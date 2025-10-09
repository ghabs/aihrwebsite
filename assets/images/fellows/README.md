# Fellow Profile Pictures

Add fellow profile pictures to this folder using the naming convention:

## Naming Convention

Fellow images should be named using the fellow's full name converted to lowercase with spaces replaced by hyphens:

### Examples:
- **John Smith** → `john-smith.jpg`
- **Mary Jane Watson** → `mary-jane-watson.png`
- **Dr. Michael O'Connor** → `dr-michael-oconnor.jpg`

### Supported formats:
- `.jpg`
- `.jpeg`
- `.png`
- `.webp`

### Image specifications:
- **Recommended size**: 400x400px or larger (will be displayed at 100x100px)
- **Aspect ratio**: Square (1:1) works best
- **Format**: Any of the supported formats above

## How it works

The system automatically:
1. Converts the fellow's name to the correct filename format
2. Checks for the image in this folder
3. If found, displays the image as a circular profile picture
4. If not found, shows the default SVG placeholder

## Adding images

Simply drop your fellow's profile picture into this folder with the correct filename, and it will automatically appear on the website after running `npm run build`.