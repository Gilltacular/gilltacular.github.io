#!/usr/bin/env python3
"""
Hero Background Generator v3.0
Interactive parameter input with defaults.
Pass reference image path as argument.

USAGE:
    python3 hero-bg-generator-v3.py /path/to/image.png        # Interactive mode
    python3 hero-bg-generator-v3.py /path/to/image.png --default   # Use defaults
    python3 hero-bg-generator-v3.py                           # Prompt for image path + all params
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
import random
import os
import sys
from pathlib import Path

# ============================================================================
# HELPER: PROMPT WITH DEFAULT
# ============================================================================

def prompt(label, default, type_func=str):
    """Prompt user for input with a default value."""
    val = input(f"  {label} [{default}]: ").strip()
    if val == "":
        return type_func(default)
    try:
        return type_func(val)
    except ValueError:
        print(f"    Invalid input, using default: {default}")
        return type_func(default)

def hex_to_rgb(hex_str):
    """Convert hex string to RGB tuple."""
    hex_str = hex_str.lstrip('#')
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

# ============================================================================
# CODE STRINGS
# ============================================================================

CODE_STRINGS = [
    "function getData() {}",
    "class Engine extends Base",
    "const result = await fetch()",
    "for(let i=0;i<n;i++)",
    "async function handle()",
    "def process(data):",
    "import module",
    "export default class",
    "try { } catch(e)",
    "implements Interface",
    "return result",
    "if(cond) { } else { }",
    "override virtual",
    "private readonly field",
    "public async method()",
    "protected static const",
    "while(!done) { }",
    "switch(val) { case: }",
    "new Promise((resolve) =>)",
    "const map = new Map()",
    "let arr = [1, 2, 3]",
    "void execute()",
    "namespace Core { }",
]

DOCSTRINGS = [
    "/** documentation */",
    "// TODO: refactor",
    "// FIXME: edge case",
    "/* @param data */",
    "// @returns Promise",
]

# ============================================================================
# IMAGE LOADING & MASKING
# ============================================================================

def load_and_resize_reference(filepath, width, height):
    img = Image.open(filepath)
    img = img.convert('RGB')
    img = img.resize((width, height), Image.Resampling.LANCZOS)
    return img

def create_architecture_mask(img, threshold, blur_radius):
    arr = np.array(img)
    brightness = arr.mean(axis=2)
    mask_raw = (brightness > threshold).astype(np.float32) * 255
    mask_img = Image.fromarray(mask_raw.astype(np.uint8), 'L')
    mask_img = mask_img.filter(ImageFilter.GaussianBlur(radius=blur_radius))
    return np.array(mask_img, dtype=np.float32)

# ============================================================================
# WOOL TEXTURE
# ============================================================================

def generate_wool_texture(width, height, fabric_color):
    base = np.full((height, width, 3), fabric_color, dtype=np.float32)
    noise = np.random.randint(-5, 6, (height, width, 1), dtype=np.int16).astype(np.float32)
    base += noise
    for y in range(0, height, 3):
        base[y, :, 0] += np.random.uniform(-3, 1, width)
    for x in range(0, width, 3):
        base[:, x, 0] += np.random.uniform(-1, 3, height)
    base = np.clip(base, 0, 255).astype(np.uint8)
    return Image.fromarray(base, 'RGB')

# ============================================================================
# CODE OVERLAY
# ============================================================================

def load_font(size):
    font_paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
        "/usr/share/fonts/TTF/DejaVuSansMono.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf",
        "/usr/share/fonts/TTF/LiberationMono-Regular.ttf",
        "/usr/share/fonts/ttf-jetbrains-mono/JetBrainsMono-Regular.ttf",
    ]
    for path in font_paths:
        try:
            return ImageFont.truetype(path, size)
        except (IOError, OSError):
            continue
    print("  WARNING: Could not find monospace font, using default")
    return ImageFont.load_default()

def measure_text(font, text):
    bbox = font.getbbox(text)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]

def overlay_code_strings(width, height, mask_array, params):
    orientation = params['code_orientation']
    spacing_y = params['code_spacing_y']
    spacing_x = params['code_spacing_x']
    font_size = params['code_font_size']
    op_min = params['code_opacity_min']
    op_max = params['code_opacity_max']
    copper = params['copper']
    amber = params['amber']

    font = load_font(font_size)
    code_overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(code_overlay)

    if orientation == 'vertical':
        # Column-by-column scan, draw characters vertically
        char_offset = font_size + 2
        for x in range(0, width, max(1, spacing_x // 3)):
            col_offset = random.randint(0, spacing_y)
            y = col_offset
            while y < height:
                mx = min(x, width - 1)
                my = min(y, height - 1)
                mask_val = mask_array[my, mx]

                if mask_val > 30:
                    if random.random() < 0.15:
                        code = random.choice(DOCSTRINGS)
                        base_color = amber
                        op_boost = 20
                    else:
                        code = random.choice(CODE_STRINGS)
                        base_color = copper
                        op_boost = 0

                    brightness_factor = mask_val / 255.0
                    base_op = int(op_min + (op_max - op_min) * brightness_factor)
                    opacity = max(40, min(200, base_op + random.randint(-15, 15) + op_boost))
                    color = (base_color[0], base_color[1], base_color[2], opacity)

                    # Draw each character stacked vertically
                    cy = y
                    for ch in code:
                        if cy >= height:
                            break
                        draw.text((x, cy), ch, font=font, fill=color)
                        _, ch_h = measure_text(font, ch)
                        cy += ch_h + 1
                    y = cy + spacing_y
                else:
                    y += spacing_y

    else:
        # Horizontal (original approach)
        for y in range(0, height, spacing_y):
            row_offset = random.randint(0, spacing_x)
            for x in range(row_offset, width, spacing_x):
                mx = min(x, width - 1)
                my = min(y, height - 1)
                mask_val = mask_array[my, mx]

                if mask_val > 30:
                    if random.random() < 0.15:
                        code = random.choice(DOCSTRINGS)
                        base_color = amber
                        op_boost = 20
                    else:
                        code = random.choice(CODE_STRINGS)
                        base_color = copper
                        op_boost = 0

                    brightness_factor = mask_val / 255.0
                    base_op = int(op_min + (op_max - op_min) * brightness_factor)
                    opacity = max(40, min(200, base_op + random.randint(-15, 15) + op_boost))
                    color = (base_color[0], base_color[1], base_color[2], opacity)
                    draw.text((x, y), code, font=font, fill=color)

    return code_overlay

# ============================================================================
# CROSS
# ============================================================================

def add_cross(width, height, mask_array, cross_visibility, copper):
    cross_overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(cross_overlay)

    search_top = int(height * 0.15)
    search_bottom = int(height * 0.45)
    search_left = int(width * 0.45)
    search_right = int(width * 0.75)

    best_pos = None
    best_val = 255
    for y in range(search_top, search_bottom, 5):
        for x in range(search_left, search_right, 5):
            if y < mask_array.shape[0] and x < mask_array.shape[1]:
                val = mask_array[y, x]
                if 40 < val < 120 and val < best_val:
                    best_val = val
                    best_pos = (x, y)

    if best_pos is None:
        best_pos = ((search_left + search_right) // 2, (search_top + search_bottom) // 2)

    cx, cy = best_pos
    cross_size = int(min(width, height) * 0.025)
    alpha = int(255 * (cross_visibility / 10.0))
    color = (copper[0], copper[1], copper[2], alpha)

    draw.line([(cx, cy - cross_size), (cx, cy + cross_size)], fill=color, width=2)
    bar_w = int(cross_size * 0.6)
    draw.line([(cx - bar_w, cy), (cx + bar_w, cy)], fill=color, width=2)

    return cross_overlay

# ============================================================================
# FINISHING
# ============================================================================

def apply_vignette(img, opacity):
    arr = np.array(img, dtype=np.float32)
    h, w = arr.shape[:2]
    y_coords = np.arange(h).reshape(-1, 1)
    x_coords = np.arange(w).reshape(1, -1)
    cx, cy = w / 2, h / 2
    max_dist = np.sqrt(cx**2 + cy**2)
    dist = np.sqrt((x_coords - cx)**2 + (y_coords - cy)**2) / max_dist
    factor = 1.0 - (dist * opacity)
    factor = np.clip(factor, 0, 1)
    arr = arr * factor[:, :, np.newaxis]
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    return Image.fromarray(arr, 'RGB')

def apply_frost_blur(img, radius, blend_amount):
    blurred = img.filter(ImageFilter.GaussianBlur(radius=radius))
    return Image.blend(img, blurred, blend_amount)

def apply_scrim(img, opacity_percent):
    overlay = Image.new('RGBA', img.size, (0, 0, 0, int(opacity_percent * 2.55)))
    result = Image.alpha_composite(img.convert('RGBA'), overlay)
    return result.convert('RGB')

def color_grade(img):
    arr = np.array(img, dtype=np.float32)
    arr *= 0.85
    arr[:, :, 0] = np.clip(arr[:, :, 0] * 1.05, 0, 255)
    arr[:, :, 2] = np.clip(arr[:, :, 2] * 0.90, 0, 255)
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    return Image.fromarray(arr, 'RGB')

# ============================================================================
# COMPOSITE
# ============================================================================

def composite_layers(arch_img, wool_img, mask_array, code_overlay, cross_overlay):
    mask_normalized = mask_array.astype(np.uint8)
    mask_img = Image.fromarray(mask_normalized, 'L')
    composited = Image.composite(arch_img, wool_img, mask_img)
    composited_rgba = composited.convert('RGBA')
    composited_rgba = Image.alpha_composite(composited_rgba, code_overlay)
    composited_rgba = Image.alpha_composite(composited_rgba, cross_overlay)
    return composited_rgba.convert('RGB')

# ============================================================================
# GENERATE VARIANT
# ============================================================================

def generate_variant(variant_name, width, height, params):
    is_portrait = width < height

    print(f"\n{'='*50}")
    print(f"Generating {variant_name} ({width}x{height})")
    print(f"{'='*50}")

    print("  Loading reference image...", end=" ", flush=True)
    arch_img = load_and_resize_reference(params['reference_image'], width, height)
    print("OK")

    print("  Creating architecture mask...", end=" ", flush=True)
    mask_array = create_architecture_mask(arch_img, params['mask_threshold'], params['mask_blur_radius'])
    print("OK")

    print("  Generating merino wool texture...", end=" ", flush=True)
    wool_img = generate_wool_texture(width, height, params['fabric_dark'])
    print("OK")

    print("  Overlaying code strings on architecture...", end=" ", flush=True)
    code_overlay = overlay_code_strings(width, height, mask_array, params)
    print("OK")

    print("  Adding distant cross...", end=" ", flush=True)
    cross_overlay = add_cross(width, height, mask_array, params['cross_visibility'], params['copper'])
    print("OK")

    print("  Compositing layers...", end=" ", flush=True)
    composited = composite_layers(arch_img, wool_img, mask_array, code_overlay, cross_overlay)
    print("OK")

    print("  Applying color grading...", end=" ", flush=True)
    graded = color_grade(composited)
    print("OK")

    print("  Applying frost blur...", end=" ", flush=True)
    blurred = apply_frost_blur(graded, params['frost_blur_radius'], params['frost_blend_amount'])
    print("OK")

    print("  Applying vignette...", end=" ", flush=True)
    vignetted = apply_vignette(blurred, params['vignette_opacity'])
    print("OK")

    print("  Applying scrim...", end=" ", flush=True)
    final = apply_scrim(vignetted, params['scrim_opacity'])
    print("OK")

    output_dir = Path(params['output_dir'])
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"hero-bg-{variant_name}.webp"
    final.save(output_path, "WEBP", quality=params['quality'], method=6)

    file_size_kb = os.path.getsize(output_path) / 1024
    print(f"\n  Saved: {output_path.name} ({file_size_kb:.1f} KB)")
    if file_size_kb > 150:
        print(f"  NOTE: File exceeds 150KB target. Lower 'quality' to reduce.")

    return output_path

# ============================================================================
# INTERACTIVE PROMPTS
# ============================================================================

def collect_params(image_arg):
    """Collect all parameters interactively, or use defaults."""
    use_defaults = '--default' in sys.argv

    params = {}

    print("\n" + "="*50)
    print("HERO BACKGROUND GENERATOR v3.0")
    print("="*50)

    # --- IMAGE PATH ---
    if image_arg and not image_arg.startswith('--'):
        params['reference_image'] = image_arg
        print(f"\n  Reference image: {image_arg}")
    else:
        if use_defaults:
            params['reference_image'] = "reference.jpg"
        else:
            val = input(f"\n  Path to reference image [reference.jpg]: ").strip()
            params['reference_image'] = val if val else "reference.jpg"

    # Check file exists
    if not os.path.exists(params['reference_image']):
        print(f"\n  ERROR: File not found: {params['reference_image']}")
        print("  Please provide a valid image path.\n")
        sys.exit(1)

    if use_defaults:
        # Fill all defaults
        params['output_dir'] = "./assets/hero-backgrounds"
        params['generate_desktop'] = True
        params['generate_tablet'] = True
        params['generate_mobile'] = True
        params['mask_threshold'] = 45
        params['mask_blur_radius'] = 40
        params['code_orientation'] = "horizontal"
        params['code_spacing_y'] = 22
        params['code_spacing_x'] = 140
        params['code_font_size'] = 16
        params['code_opacity_min'] = 60
        params['code_opacity_max'] = 160
        params['base_black'] = hex_to_rgb("040303")
        params['fabric_dark'] = hex_to_rgb("15110e")
        params['copper'] = hex_to_rgb("b88657")
        params['amber'] = hex_to_rgb("8f6b45")
        params['cross_visibility'] = 3
        params['vignette_opacity'] = 0.35
        params['frost_blur_radius'] = 9
        params['frost_blend_amount'] = 0.15
        params['scrim_opacity'] = 13
        params['quality'] = 70
        print("  Using all defaults.\n")
        return params

    # --- OUTPUT ---
    print("\n--- OUTPUT ---")
    params['output_dir'] = prompt("Output directory", "./assets/hero-backgrounds")

    print("\n--- BREAKPOINTS ---")
    gen_desktop = prompt("Generate desktop (16:9)? (y/n)", "y")
    gen_tablet = prompt("Generate tablet (4:3)? (y/n)", "y")
    gen_mobile = prompt("Generate mobile portrait (9:16)? (y/n)", "y")
    params['generate_desktop'] = gen_desktop.lower().startswith('y')
    params['generate_tablet'] = gen_tablet.lower().startswith('y')
    params['generate_mobile'] = gen_mobile.lower().startswith('y')

    # --- MASK DETECTION ---
    print("\n--- ARCHITECTURE DETECTION ---")
    print("  (Higher threshold = only bright areas get code)")
    print("  (Lower threshold = more of image gets code)")
    params['mask_threshold'] = prompt("Mask threshold (10-100)", 45, int)
    params['mask_blur_radius'] = prompt("Mask blur radius (sharp edge = low, smooth fade = high)", 40, int)

    # --- CODE ---
    print("\n--- CODE STRINGS ---")
    orient = prompt("Code orientation (horizontal/vertical)", "horizontal")
    params['code_orientation'] = orient.lower() if orient.lower() in ('horizontal', 'vertical') else 'horizontal'
    params['code_spacing_y'] = prompt("Code vertical spacing (px)", 22, int)
    params['code_spacing_x'] = prompt("Code horizontal spacing (px)", 140, int)
    params['code_font_size'] = prompt("Code font size (px)", 16, int)
    params['code_opacity_min'] = prompt("Minimum code opacity (0-255)", 60, int)
    params['code_opacity_max'] = prompt("Maximum code opacity (0-255)", 160, int)

    # --- COLORS ---
    print("\n--- COLORS ---")
    print("  (Enter as hex without #, e.g. 040303)")
    params['base_black'] = hex_to_rgb(prompt("Base black", "040303"))
    params['fabric_dark'] = hex_to_rgb(prompt("Fabric dark", "15110e"))
    params['copper'] = hex_to_rgb(prompt("Copper (code color)", "b88657"))
    params['amber'] = hex_to_rgb(prompt("Amber (docstring color)", "8f6b45"))

    # --- CROSS ---
    print("\n--- CROSS ---")
    print("  (1=invisible, 10=bold. Target: 3)")
    params['cross_visibility'] = prompt("Cross visibility (1-10)", 3, int)

    # --- FINISHING ---
    print("\n--- FINISHING ---")
    params['vignette_opacity'] = prompt("Vignette opacity (0.0-1.0)", 0.35, float)
    params['frost_blur_radius'] = prompt("Frost blur radius (px)", 9, int)
    params['frost_blend_amount'] = prompt("Frost blend amount (0.0-1.0)", 0.15, float)
    params['scrim_opacity'] = prompt("Scrim opacity (%)", 13, int)
    params['quality'] = prompt("WebP quality (1-100, lower=smaller file)", 70, int)

    print("\n" + "="*50 + "\n")
    return params

# ============================================================================
# MAIN
# ============================================================================

def main():
    # Parse args
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    image_arg = args[0] if args else None

    params = collect_params(image_arg)

    breakpoints = []

    if params['generate_desktop']:
        breakpoints.append(("desktop", 3000, 1688))
    if params['generate_tablet']:
        breakpoints.append(("tablet", 2048, 1536))
    if params['generate_mobile']:
        breakpoints.append(("mobile_portrait", 844, 1500))

    if not breakpoints:
        print("No breakpoints selected. Nothing to generate.")
        return

    for name, w, h in breakpoints:
        generate_variant(name, w, h, params)

    print(f"\n{'='*50}")
    print(f"All variants generated!")
    print(f"Output: {params['output_dir']}")
    print(f"{'='*50}\n")

if __name__ == "__main__":
    main()