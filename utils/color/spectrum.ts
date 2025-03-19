import { calculate } from "../machine-learning/color-spectrum-cnn-v5";
import { CIE_MATCH_X, CIE_MATCH_Y, CIE_MATCH_Z } from "./cie";
import { XYZ, xyzToRgb, RGB, rgbToXyz } from "./color-space";

export function spectrumToXyz(spectrum: number[]): {
  x: number;
  y: number;
  z: number;
} {
  const deltaLambda = 10; // 파장 간격 (nm)

  // 길이 검증
  if (spectrum.length !== CIE_MATCH_X.length) {
    throw new Error(
      "Spectrum length must match the length of the CIE matching functions."
    );
  }

  // 정규화 상수 k 계산
  const k =
    1 / CIE_MATCH_Y.reduce((sum, yValue) => sum + yValue * deltaLambda, 0);

  // XYZ 값 계산
  let X = 0,
    Y = 0,
    Z = 0;

  for (let i = 0; i < spectrum.length; i++) {
    const R = Math.max(0, Math.min(1, spectrum[i])); // 반사율 또는 방사율 클램프 (0~1)
    X += R * CIE_MATCH_X[i] * deltaLambda;
    Y += R * CIE_MATCH_Y[i] * deltaLambda;
    Z += R * CIE_MATCH_Z[i] * deltaLambda;
  }

  // 정규화
  X *= k;
  Y *= k;
  Z *= k;

  return { x: X, y: Y, z: Z };
}

export function xyzToSpectrum(xyz: XYZ): number[] {
  return calculate(xyz);
}

export function spectrumToRgb(spectrum: number[]): {
  r: number;
  g: number;
  b: number;
} {
  const xyz = spectrumToXyz(spectrum);
  return xyzToRgb(xyz);
}

export function rgbToSpectrum(rgb: RGB): number[] {
  const xyz = rgbToXyz(rgb);
  return xyzToSpectrum(xyz);
}
