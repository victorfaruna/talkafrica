# Local Font Implementation

This project now uses a local font implementation for better performance and reduced external dependencies.

## Font Files Setup

To complete the local font implementation, you need to add the actual Poppins font files to the `static/fonts/` directory.

### Required Font Files

Place the following font files in `static/fonts/`:

- `Poppins-Regular.woff2`
- `Poppins-Regular.woff`
- `Poppins-Medium.woff2`
- `Poppins-Medium.woff`
- `Poppins-SemiBold.woff2`
- `Poppins-SemiBold.woff`
- `Poppins-Bold.woff2`
- `Poppins-Bold.woff`
- `Poppins-Light.woff2`
- `Poppins-Light.woff`

### How to Get Font Files

1. **Download from Google Fonts:**
   - Visit [Google Fonts - Poppins](https://fonts.google.com/specimen/Poppins)
   - Click "Download family" to get the font files
   - Extract the files and copy the required formats to `static/fonts/`

2. **Alternative: Use a font service:**
   - You can use services like [Font Squirrel](https://www.fontsquirrel.com/) to convert fonts
   - Or use tools like [Google Web Fonts Helper](https://google-webfonts-helper.herokuapp.com/fonts/poppins)

### Font Implementation Features

- **Local font detection**: The CSS checks for locally installed Poppins fonts first
- **Fallback system**: Graceful degradation to system fonts if local files aren't available
- **Performance optimized**: Uses `font-display: swap` for better loading experience
- **Multiple formats**: Supports both WOFF2 and WOFF formats for better browser compatibility

### Current Implementation

The font implementation includes:

- CSS variables for easy font management
- System font fallbacks for better performance
- Optimized font loading with `font-display: swap`
- Support for multiple font weights (300, 400, 500, 600, 700)

### Testing

After adding the font files, you can test the implementation by:

1. Running the development server: `npm run dev`
2. Checking the browser's Network tab to ensure fonts are loading locally
3. Verifying that the fonts display correctly in different weights

### Benefits

- **Faster loading**: No external requests to Google Fonts
- **Better privacy**: No data sent to Google
- **Offline support**: Fonts work without internet connection
- **Customization**: Full control over font loading and fallbacks
