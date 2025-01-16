export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface CMY {
  c: number;
  m: number;
  y: number;
}

export interface XYZ {
  x: number;
  y: number;
  z: number;
}

export function hexToRgb(hex: string): RGB {
  const parsed = parseInt(hex.replace("#", ""), 16);
  return {
    r: (parsed >> 16) & 0xff,
    g: (parsed >> 8) & 0xff,
    b: parsed & 0xff,
  };
}

export function rgbToHex(rgb: RGB): string {
  const r = Math.round(rgb.r).toString(16).padStart(2, "0");
  const g = Math.round(rgb.g).toString(16).padStart(2, "0");
  const b = Math.round(rgb.b).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}

export function rgbToCmy({ r, g, b }: RGB): CMY {
  return {
    c: 1 - r / 255,
    m: 1 - g / 255,
    y: 1 - b / 255,
  };
}

export function cmyToRgb({ c, m, y }: CMY): RGB {
  return {
    r: Math.round((1 - c) * 255),
    g: Math.round((1 - m) * 255),
    b: Math.round((1 - y) * 255),
  };
}

export function xyzToRgb({ x, y, z }: { x: number; y: number; z: number }): {
  r: number;
  g: number;
  b: number;
} {
  // 변환 행렬 적용
  const rLinear = 3.2406 * x - 1.5372 * y - 0.4986 * z;
  const gLinear = -0.9689 * x + 1.8758 * y + 0.0415 * z;
  const bLinear = 0.0557 * x - 0.204 * y + 1.057 * z;

  // 감마 보정
  const gammaCorrect = (value: number): number =>
    value <= 0.0031308
      ? value * 12.92
      : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;

  return {
    r: Math.max(0, Math.min(255, Math.round(gammaCorrect(rLinear) * 255))),
    g: Math.max(0, Math.min(255, Math.round(gammaCorrect(gLinear) * 255))),
    b: Math.max(0, Math.min(255, Math.round(gammaCorrect(bLinear) * 255))),
  };
}

export function rgbToXyz({ r, g, b }: RGB): {
  x: number;
  y: number;
  z: number;
} {
  // RGB 선형화
  const linearize = (value: number): number =>
    value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);

  const rLinear = linearize(r / 255);
  const gLinear = linearize(g / 255);
  const bLinear = linearize(b / 255);

  // RGB → XYZ 변환 행렬
  const x = 0.4124564 * rLinear + 0.3575761 * gLinear + 0.1804375 * bLinear;
  const y = 0.2126729 * rLinear + 0.7151522 * gLinear + 0.072175 * bLinear;
  const z = 0.0193339 * rLinear + 0.119192 * gLinear + 0.9503041 * bLinear;

  return { x, y, z };
}
