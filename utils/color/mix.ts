import { RGB } from "./color-space";

export interface Paint<T> {
  color: T;
  ratio: number;
}

export function interpolateMix(...paints: Paint<RGB>[]): RGB {
  const totalWeight = paints.reduce((sum, paint) => sum + paint.ratio, 0);

  return {
    r: Math.round(
      paints.reduce(
        (r, paint) => r + (paint.color.r * paint.ratio) / totalWeight,
        0
      )
    ),
    g: Math.round(
      paints.reduce(
        (g, paint) => g + (paint.color.g * paint.ratio) / totalWeight,
        0
      )
    ),
    b: Math.round(
      paints.reduce(
        (b, paint) => b + (paint.color.b * paint.ratio) / totalWeight,
        0
      )
    ),
  };
}

// Kubelka-Munk: 반사율에서 K/S 계산
function reflectanceToKubelkaMunk(reflectance: number[]): number[] {
  return reflectance.map((R) => (1 - R) ** 2 / (2 * R));
}

// Kubelka-Munk: K/S에서 반사율 계산
function kubelkaMunkToReflectance(kOverS: number[]): number[] {
  return kOverS.map((ks) => {
    const term = Math.sqrt((1 + ks) ** 2 - 1);
    return (1 + ks - term) / (1 + ks);
  });
}

// 색상 혼합 함수 (Kubelka-Munk 기반)
export function kubelkaMunkMix(
  paints: Paint<number[]>[],
  wavelengthCount: number
): number[] {
  if (paints.length === 0) {
    throw new Error("At least one paint must be provided.");
  }

  // 초기 K/S 값 (혼합 초기화)
  const mixedKOverS = new Array(wavelengthCount).fill(0);

  // 각 물감의 K/S 값에 가중치 적용 및 합산
  paints.forEach(({ color, ratio }) => {
    const kOverS = reflectanceToKubelkaMunk(color);
    kOverS.forEach((ks, i) => {
      mixedKOverS[i] += ks * ratio;
    });
  });

  // 혼합된 K/S 값으로부터 반사율 계산
  return kubelkaMunkToReflectance(mixedKOverS);
}
