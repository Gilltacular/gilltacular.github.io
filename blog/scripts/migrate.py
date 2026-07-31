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
        print(f"ERROR: No .md fiels found in {SRC_DIR}")
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

def main() -> None:
    """Main entry point for migration script. """

    validate_environment()
    source_files = list(SRC_DIR.glob("*.md"))
    create_backup(source_files)

    print("\n Woohoo! Setup complete. Ready for migration!")

if __name__ == "__main__":
    main()
