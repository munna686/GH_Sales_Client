# Primary Color Customization Guide

This application uses CSS variables for theming, allowing you to easily change the primary color across all components.

## Quick Start

To change the primary color from green to your preferred color, add these CSS variables to your `styles.scss` file:

```scss
:root {
  /* Define your primary color palette */
  --p-primary-50: #e0f2fe;   /* Lightest - for backgrounds */
  --p-primary-100: #bae6fd;  /* Very light - for hover backgrounds */
  --p-primary-400: #38bdf8;  /* Light - for gradients */
  --p-primary-500: #0ea5e9;  /* Base - main primary color */
  --p-primary-600: #0284c7;  /* Medium dark - for darker variants */
  --p-primary-700: #0369a1;  /* Dark - for text on light backgrounds */
  --p-primary-800: #075985;  /* Very dark - for text on very light backgrounds */
}
```

## Example Color Palettes

### Blue (Current Example Above)
- `--p-primary-500: #0ea5e9` - Sky Blue

### Purple
```scss
:root {
  --p-primary-50: #faf5ff;
  --p-primary-100: #f3e8ff;
  --p-primary-400: #c084fc;
  --p-primary-500: #a855f7;
  --p-primary-600: #9333ea;
  --p-primary-700: #7e22ce;
  --p-primary-800: #6b21a8;
}
```

### Orange
```scss
:root {
  --p-primary-50: #fff7ed;
  --p-primary-100: #ffedd5;
  --p-primary-400: #fb923c;
  --p-primary-500: #f97316;
  --p-primary-600: #ea580c;
  --p-primary-700: #c2410c;
  --p-primary-800: #9a3412;
}
```

### Red
```scss
:root {
  --p-primary-50: #fef2f2;
  --p-primary-100: #fee2e2;
  --p-primary-400: #f87171;
  --p-primary-500: #ef4444;
  --p-primary-600: #dc2626;
  --p-primary-700: #b91c1c;
  --p-primary-800: #991b1b;
}
```

## Components Using Primary Color Variables

The following components automatically adapt to your primary color:
- **My Profile Component** - All green colors (gradients, backgrounds, text, icons)
- Add other components here as you update them

## Default Color (Green)
If no CSS variables are defined, the application defaults to:
- `--p-primary-500: #10b981` (Emerald Green)

## Testing Your Colors

1. Add your color variables to `src/assets/styles.scss`
2. Restart your development server
3. Navigate to the My Profile page
4. All previously green elements should now use your new color

## Need a Color Palette?

Use tools like:
- [Tailwind Color Generator](https://uicolors.app/create)
- [Coolors](https://coolors.co/)
- [Adobe Color](https://color.adobe.com/)

Generate a full palette from your desired primary color and map the shades to the variables above.
