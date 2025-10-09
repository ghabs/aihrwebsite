#!/usr/bin/env python3
"""
Fellow Image Processor
This script processes images for the fellow profiles, either by:
1. Analyzing existing images and extracting metadata
2. Generating new images based on descriptions
3. Resizing and optimizing images for web use

Usage:
    python process_fellow_images.py --process-folder input_images/
    python process_fellow_images.py --generate-from-names
    python process_fellow_images.py --analyze-existing
"""

import os
import sys
from pathlib import Path
from PIL import Image, ImageOps
from google import genai
from google.genai import types
import argparse
import json
from io import BytesIO
import re

def load_environment():
    """Load environment variables from .env file"""
    env_path = Path('.env')
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                if line.strip() and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key] = value

def setup_client():
    """Setup Google AI client with API key"""
    load_environment()

    api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key or api_key == 'your_api_key_here':
        print("❌ Please set your GOOGLE_API_KEY in the .env file")
        print("   Get your API key from: https://aistudio.google.com/app/apikey")
        return None

    # Remove quotes if present
    api_key = api_key.strip('"\'')

    print(f"🔑 Using API key: {api_key[:10]}...{api_key[-4:]}")

    try:
        # Configure the client with the API key
        import google.generativeai as genai_config
        genai_config.configure(api_key=api_key)

        client = genai.Client(api_key=api_key)
        return client
    except Exception as e:
        print(f"❌ Error setting up Google AI client: {e}")
        return None

def get_fellow_names():
    """Extract fellow names from the content/fellows directory"""
    fellows_dir = Path('content/fellows')
    if not fellows_dir.exists():
        print("❌ Fellows directory not found")
        return []

    fellow_names = []
    for file_path in fellows_dir.glob('*.md'):
        # Read the markdown file to get the actual name
        with open(file_path, 'r') as f:
            content = f.read()
            # Extract name from frontmatter
            if content.startswith('---'):
                frontmatter = content.split('---')[1]
                for line in frontmatter.split('\n'):
                    if line.strip().startswith('name:'):
                        name = line.split('name:', 1)[1].strip().strip('"\'')
                        fellow_names.append(name)
                        break

    return fellow_names

def name_to_filename(name):
    """Convert fellow name to image filename"""
    filename = name.lower()
    filename = re.sub(r'[^a-z0-9\s-]', '', filename)  # Remove special chars
    filename = re.sub(r'\s+', '-', filename)  # Replace spaces with hyphens
    filename = re.sub(r'-+', '-', filename)  # Replace multiple hyphens
    filename = filename.strip('-')  # Remove leading/trailing hyphens
    return filename

def apply_crosshatch_style(client, image_path, output_path):
    """Apply crosshatch pen style to image using Google AI"""
    try:
        prompt = "Could you please do a crosshatch pen style on this image, suitable for a profile picture?"

        # Load the image
        image = Image.open(image_path)

        print(f"🎨 Applying crosshatch style to {image_path.name}...")

        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=[prompt, image],
        )

        # Process the response
        for part in response.candidates[0].content.parts:
            if part.text is not None:
                print(f"📝 AI Response: {part.text[:100]}...")
            elif part.inline_data is not None:
                # Save the generated image
                generated_image = Image.open(BytesIO(part.inline_data.data))

                # Resize and optimize for web
                generated_image = ImageOps.fit(generated_image, (400, 400), Image.Resampling.LANCZOS)

                # Convert to RGB if necessary
                if generated_image.mode in ('RGBA', 'LA', 'P'):
                    generated_image = generated_image.convert('RGB')

                generated_image.save(output_path, 'JPEG', quality=90, optimize=True)
                print(f"✅ Crosshatch style applied: {output_path}")
                return True

        print(f"❌ No image generated for {image_path}")
        return False

    except Exception as e:
        print(f"❌ Error applying crosshatch style to {image_path}: {e}")
        return False

def resize_image_for_web(image_path, output_path, size=(400, 400)):
    """Resize and optimize image for web use (fallback if AI processing fails)"""
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')

            # Resize image maintaining aspect ratio
            img = ImageOps.fit(img, size, Image.Resampling.LANCZOS)

            # Save optimized image
            img.save(output_path, 'JPEG', quality=90, optimize=True)
            print(f"✅ Optimized: {output_path}")
            return True
    except Exception as e:
        print(f"❌ Error processing {image_path}: {e}")
        return False

def process_input_folder(input_folder, apply_crosshatch=False):
    """Process images from an input folder and move them to assets/images/fellows/"""
    input_path = Path(input_folder)
    if not input_path.exists():
        print(f"❌ Input folder {input_folder} not found")
        return

    output_dir = Path('assets/images/fellows')
    output_dir.mkdir(parents=True, exist_ok=True)

    # Setup client for AI processing if needed
    client = None
    if apply_crosshatch:
        client = setup_client()
        if not client:
            print("❌ Cannot apply crosshatch style without valid API key")
            return

    fellow_names = get_fellow_names()
    print(f"📋 Found {len(fellow_names)} fellows")

    # Get image files
    image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'}
    image_files = [f for f in input_path.iterdir()
                   if f.is_file() and f.suffix.lower() in image_extensions]

    print(f"📸 Found {len(image_files)} images to process")
    if apply_crosshatch:
        print("🎨 Crosshatch pen style will be applied to all images")

    # Try to match images to fellows
    processed_count = 0
    for image_file in image_files:
        print(f"\n🔍 Processing: {image_file.name}")

        # Try to find matching fellow
        best_match = None
        image_name_lower = image_file.stem.lower()

        for fellow_name in fellow_names:
            fellow_filename = name_to_filename(fellow_name)
            if fellow_filename in image_name_lower or image_name_lower in fellow_filename:
                best_match = fellow_name
                break

        if best_match:
            output_filename = name_to_filename(best_match) + '.jpg'
            output_path = output_dir / output_filename

            # Apply crosshatch style or just resize
            success = False
            if apply_crosshatch and client:
                success = apply_crosshatch_style(client, image_file, output_path)
                if not success:
                    print("⚠️  Crosshatch failed, falling back to regular resize...")
                    success = resize_image_for_web(image_file, output_path)
            else:
                success = resize_image_for_web(image_file, output_path)

            if success:
                style_note = " (with crosshatch style)" if apply_crosshatch else ""
                print(f"✅ Matched to: {best_match} → {output_filename}{style_note}")
                processed_count += 1
            else:
                print(f"❌ Failed to process image for {best_match}")
        else:
            print(f"⚠️  No matching fellow found for {image_file.name}")
            print("   Available fellows:")
            for name in fellow_names[:5]:  # Show first 5
                print(f"     - {name} → {name_to_filename(name)}.jpg")
            if len(fellow_names) > 5:
                print(f"     ... and {len(fellow_names) - 5} more")

    print(f"\n🎉 Successfully processed {processed_count}/{len(image_files)} images")

def analyze_existing_images():
    """Analyze existing images in the fellows folder"""
    fellows_dir = Path('assets/images/fellows')
    if not fellows_dir.exists():
        print("❌ Fellows images directory not found")
        return

    image_files = list(fellows_dir.glob('*.jpg')) + list(fellows_dir.glob('*.jpeg')) + \
                 list(fellows_dir.glob('*.png')) + list(fellows_dir.glob('*.webp'))

    fellow_names = get_fellow_names()

    print(f"📊 Analysis of fellow images:")
    print(f"   Total fellows: {len(fellow_names)}")
    print(f"   Images found: {len(image_files)}")
    print(f"   Coverage: {len(image_files)}/{len(fellow_names)} ({len(image_files)/len(fellow_names)*100:.1f}%)")

    # Show which fellows have images
    fellows_with_images = []
    fellows_without_images = []

    for fellow_name in fellow_names:
        expected_filename = name_to_filename(fellow_name)
        has_image = any(img.stem == expected_filename for img in image_files)

        if has_image:
            fellows_with_images.append(fellow_name)
        else:
            fellows_without_images.append(fellow_name)

    if fellows_with_images:
        print(f"\n✅ Fellows with images ({len(fellows_with_images)}):")
        for name in sorted(fellows_with_images):
            print(f"   - {name}")

    if fellows_without_images:
        print(f"\n❌ Fellows missing images ({len(fellows_without_images)}):")
        for name in sorted(fellows_without_images):
            expected = name_to_filename(name) + '.jpg'
            print(f"   - {name} → needs {expected}")

def main():
    parser = argparse.ArgumentParser(description='Process fellow profile images with crosshatch pen style')
    parser.add_argument('--process-folder', help='Process images from input folder')
    parser.add_argument('--crosshatch', action='store_true', help='Apply crosshatch pen style using AI')
    parser.add_argument('--analyze-existing', action='store_true', help='Analyze existing images')
    parser.add_argument('--setup-test', action='store_true', help='Test API setup')

    args = parser.parse_args()

    if args.setup_test:
        client = setup_client()
        if client:
            print("✅ Google AI client setup successful!")
            print("   You can now process images with crosshatch style")
        return

    if args.process_folder:
        process_input_folder(args.process_folder, apply_crosshatch=args.crosshatch)
    elif args.analyze_existing:
        analyze_existing_images()
    else:
        print("Usage:")
        print("  python process_fellow_images.py --process-folder input_images/")
        print("  python process_fellow_images.py --process-folder input_images/ --crosshatch")
        print("  python process_fellow_images.py --analyze-existing")
        print("  python process_fellow_images.py --setup-test")
        print("")
        print("Options:")
        print("  --crosshatch    Apply crosshatch pen style using Google AI (requires API key)")
        print("  --analyze       Show current image coverage status")
        print("  --setup-test    Verify API key is working")

if __name__ == '__main__':
    main()