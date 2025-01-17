import modelData from "./color-spectrum-cnn-v5.json";
import { XYZ } from "../color/color-space";
import { sigmoid, relu, denseLayer } from "./base";

type LayerData = {
  weights: number[][];
  biases: number[];
};

type ModelData = {
  dense_13: LayerData;
  dense_14: LayerData;
  dense_15: LayerData;
  dense_16: LayerData;
  dense_17: LayerData;
};

export function calculate(xyz: XYZ) {
  // 입력 데이터 (예: [x, y, z])
  let currentOutput = [xyz.x, xyz.y, xyz.z];

  // Layer 순차적으로 계산
  for (const layerName of Object.keys(modelData)) {
    const layer = modelData[layerName as keyof ModelData];
    const weights = layer.weights; // 가중치
    const biases = layer.biases; // 편향

    // 활성화 함수 결정 (ReLU for hidden layers, Sigmoid for output layer)
    const activation = layerName === "dense_17" ? sigmoid : relu;

    // Dense 레이어 계산
    currentOutput = denseLayer(currentOutput, weights, biases, activation);
  }

  return currentOutput;
}
