#!/usr/bin/env python3
"""
Migration script: Converts Jekyll .md files to blog-ready HTML + JSON metadata.

Usage:
    cd blog/scripts
    source venv/bin/activate
    python3 migrate.py
"""

import sys
from pathlib import Path
import shutil
from datetime import datetime
from typing import Any

# Third-party imports (installed via requirements.txt)
import markdown
import yaml

# Configuration
SCRIPT_DIR = Path(__file__).parent                          # blog/scripts/
SRC_DIR = SCRIPT_DIR.parent / "src"                         # blog/src/
CONTENT_DIR = SCRIPT_DIR.parent / "data" / "content"        # blog/data/content/
POSTS_JSON_PATH = SCRIPT_DIR.parent / "data" / "posts.json" # blog/data/posts.json
BACKUP_DIR = SCRIPT_DIR / "backups"                         # blog/scripts/backups/

def validate_environment() -> None:
    """Fail with clear error if directories do not exist."""

    # Check source directory
    if not SRC_DIR.exists():
        print(f"ERROR: Source directory not found: {SRC_DIR}")
        print("Double check directory you are in. Did you run this from the scripts/ directory?")
        sys.exit(1)
    
    # Check for .md files
    md_files = list(SRC_DIR.glob("*.md"))

    if len(md_files) == 0:
        print(f"ERROR: No .md files found in {SRC_DIR}")
        print("Make sure you have source articles in blog/src/")
        sys.exit(1)
    
    print(f"Woohoo! Found {len(md_files)} source files")

def create_backup(source_files: list[Path]) -> None:
    """Create timestamped backup of source files."""

    timestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
    backup_name = f"backup_{timestamp}"
    current_backup_dir = BACKUP_DIR / backup_name

    # Ensure parent directory exists
    if BACKUP_DIR.exists():
        for existing in BACKUP_DIR.iterdir():
            if existing.is_dir():
                shutil.rmtree(existing)
    
    # Create new backup directory
    current_backup_dir.mkdir(parents=True, exist_ok=True)

    # Copy all source files - the nitty gritty
    for src_file in source_files:
        shutil.copy2(src_file, current_backup_dir / src_file.name)

    print(f"Woohoo! Backed up {len(source_files)} files to {backup_name}")

def read_md_file(file_path: Path) -> tuple[str, str]:
    """Read .md file and split frontmatter from body.
    Returns: Tuple of (frontmatter _yaml_text, body_markdown_text)
    """
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Split at the first occurrence of ---
    parts = content.split("---", 2)

    # parts[0] = anything before first --- (should be empty but just in case)
    # parts[1] = YAML frontmatter
    # parts[2] = body + anything after

    if len(parts) < 3:
        raise ValueError(f"No YAML frontmatter found in {file_path.name}")

    frontmatter_yaml = parts[1].strip()
    body_markdown = parts[2].strip()

    return frontmatter_yaml, body_markdown

def parse_frontmatter(yaml_text: str) -> dict[str, Any]:
    """Parse YAML frontmatter into dictionary.
    Returns: Dict with title, date, tags, author (if present)
    """
    try:
        data = yaml.safe_load(yaml_text)

        # Handle edge case where YAML might return None if empty
        if data is None:
            data = {}

        # Normalize tags (might be string, list, or missing)
        tags = data.get("tags", [])
        if isinstance(tags, str):
            tags = [tags]
        elif tags is None:
            tags = []

        # Normalize date (might have time component, we want YYYY-MM-DD format only)
        date_str = data.get("date", "")
        if isinstance(date_str, str):
            date_str = date_str[:10]            # Take only date portion if datetime provided

        return {
            "title": data.get("title", "Untitled"),
            "date": date_str,
            "tags": tags,
            "author": data.get("author", None),
        }
    except yaml.YAMLError as e:
        raise ValueError(f"Failed to parse YAML: {e}")

def generate_slug(title: str) -> str:
    """Generate URL-safe slug from title.
    Examples:   "My Way of Life" -> "my-way-of-life"
                "C++ Tips & Tricks!" -> "cpp-tips-and-tricks"
    """
    slug = title.lower()                    # Lowercase title  ("AAAA" -> "aaaa")
    slug = slug.replace(" ", "-")           # Replace spaces with hyphens (" " -> "-")
    
    # Remove special characters (keep alphanumeric and hyphens)
    slug = "".join(char for char in slug if char.isalnum() or char == "-")

    while "--" in slug:                     # Collapse multiple hyphens into one ("--" -> "-")
        slug = slug.replace("--", "-")
    slug = slug.strip("-")
    return slug

def test_parsing() -> None:
    """Quick test of parsing functions."""
    test_file = SRC_DIR / "2014-10-19-my-way-of-life-writing.md"

    print(f"\nTesting: {test_file.name}")

    # Step 1: Read and split
    frontmatter_yaml, body_markdown = read_md_file(test_file)
    print(f"   Frontmatter length: {len(frontmatter_yaml)} chars")
    print(f"   Body length: {len(body_markdown)} chars")

    # Step 2: Parse the YAML
    metadata = parse_frontmatter(frontmatter_yaml)
    print(f"   Title: {metadata['title']}")
    print(f"   Date: {metadata['date']}")
    print(f"   Tags: {metadata['tags']}")

    # Step 3: Generate slug *eww*
    slug = generate_slug(metadata['title'])
    print(f"   Slug: {slug}")

def main() -> None:
    """Main entry point for migration script. """

    validate_environment()
    source_files = list(SRC_DIR.glob("*.md"))
    create_backup(source_files)

    print("\nWoohoo! Setup complete. Ready for migration!")

if __name__ == "__main__":
#    test_parsing()                            # Uncomment this for debugging
    main()
