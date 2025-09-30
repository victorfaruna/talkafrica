#!/bin/bash

# Script to set up local Space Grotesk fonts
# This script downloads the required font files for local hosting

FONTS_DIR="static/fonts"

# Create fonts directory if it doesn't exist
mkdir -p "$FONTS_DIR"

echo "Setting up local Space Grotesk fonts..."

# Note: This is a placeholder script. In a real implementation, you would:
# 1. Download the actual font files from Google Fonts or another source
# 2. Convert them to the required formats (WOFF2, WOFF)
# 3. Place them in the static/fonts directory

echo "Font directory created at: $FONTS_DIR"
echo ""
echo "To complete the setup:"
echo "1. Visit https://fonts.google.com/specimen/Space+Grotesk"
echo "2. Download the font family"
echo "3. Extract and copy the following files to $FONTS_DIR:"
echo "   - SpaceGrotesk-Regular.woff2"
echo "   - SpaceGrotesk-Regular.woff"
echo "   - SpaceGrotesk-Medium.woff2"
echo "   - SpaceGrotesk-Medium.woff"
echo "   - SpaceGrotesk-SemiBold.woff2"
echo "   - SpaceGrotesk-SemiBold.woff"
echo "   - SpaceGrotesk-Bold.woff2"
echo "   - SpaceGrotesk-Bold.woff"
echo "   - SpaceGrotesk-Light.woff2"
echo "   - SpaceGrotesk-Light.woff"
echo ""
echo "The CSS is already configured to use these fonts with fallbacks."
