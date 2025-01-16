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
  const spectrum: number[] = [];
  const wavelengths = CIE_MATCH_X.length; // 파장 범위 (10nm 간격)

  for (let i = 0; i < wavelengths; i++) {
    // TODO xyz 를 스펙트럼으로 변환하는 수학적 모델링 연구
  }

  // 스펙트럼 정규화 (0~1 범위로 스케일링)
  const maxReflectance = Math.max(...spectrum);
  return spectrum.map((value) => Math.max(0, value) / maxReflectance);
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
