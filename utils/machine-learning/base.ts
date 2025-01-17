export function relu(x: number): number {
  return Math.max(0, x);
}

export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function denseLayer(
  input: number[],
  weights: number[][],
  biases: number[],
  activation: (x: number) => number
): number[] {
  const output: number[] = [];
  for (let i = 0; i < weights[0].length; i++) {
    // Output 차원
    let z = biases[i]; // 편향 추가
    for (let j = 0; j < input.length; j++) {
      // Input 차원
      z += input[j] * weights[j][i];
    }
    output.push(activation(z)); // 활성화 함수 적용
  }
  return output;
}
