export const hexToRGB = (hex: string): string => {
  hex = hex.replace(/^#/, "");

  let r: number, g: number, b: number;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else {
    throw new Error("Invalid hex color format");
  }

  const rgbValue = [r, g, b].join(" ");
  return rgbValue;
};

// Helper function to convert RGB values to HSL
const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

// Helper function to extract RGB values from hex
const hexToRgbValues = (hex: string): { r: number; g: number; b: number } => {
  hex = hex.replace(/^#/, "");

  let r: number, g: number, b: number;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else {
    throw new Error("Invalid hex color format");
  }

  return { r, g, b };
};

export const hexToHSL = (hex: string): string => {
  const { r, g, b } = hexToRgbValues(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  
  return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
};

export const hexToHSLObject = (hex: string): { h: number; s: number; l: number } => {
  const { r, g, b } = hexToRgbValues(hex);
  return rgbToHsl(r, g, b);
};


