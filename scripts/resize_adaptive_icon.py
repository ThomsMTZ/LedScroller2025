"""
Resize icon.png to create a proper Android adaptive icon foreground.
The content is shrunk to ~60% and centered on a 1024x1024 canvas
with the app's background color (#0a0a0e), keeping all content
within the Android adaptive icon safe zone (inner 66%).
"""
from PIL import Image

CANVAS_SIZE = 1024
# Safe zone is inner 66%, so content should be ~60% to have extra margin
CONTENT_RATIO = 0.78
BG_COLOR = (10, 10, 14, 255)  # #0a0a0e

icon_path = "assets/icon.png"
output_path = "assets/adaptive-icon.png"

# Open the source icon
img = Image.open(icon_path).convert("RGBA")

# Calculate the new size for the content
content_size = int(CANVAS_SIZE * CONTENT_RATIO)

# Resize the icon content (high quality)
resized = img.resize((content_size, content_size), Image.LANCZOS)

# Create the canvas with solid background
canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), BG_COLOR)

# Center the content on the canvas
offset = (CANVAS_SIZE - content_size) // 2
canvas.paste(resized, (offset, offset), resized)

# Save
canvas.save(output_path, "PNG")
print(f"Done! Saved {output_path} ({CANVAS_SIZE}x{CANVAS_SIZE})")
print(f"Content size: {content_size}x{content_size}, offset: {offset}px on each side")
