"use client";

import { hexToRgb, rgbToHex } from "@/utils/color/color-space";
import { interpolateMix, realisticMix } from "@/utils/color/mix";
import { useMemo, useState } from "react";
import ColorPicker from "./components/color-picker";
import { rgbToSpectrum, spectrumToRgb } from "@/utils/color/spectrum";

export default function Page() {
  const [c1, setC1] = useState("#000000");
  const [c1R, setC1R] = useState(1);
  const [c2, setC2] = useState("#000000");
  const [c2R, setC2R] = useState(1);
  const mixed = useMemo(() => {
    return rgbToHex(
      interpolateMix(
        { color: hexToRgb(c1), ratio: c1R / (c1R + c2R) },
        { color: hexToRgb(c2), ratio: c2R / (c1R + c2R) }
      )
    );
  }, [c1, c1R, c2, c2R]);
  const realMixed = useMemo(() => {
    return rgbToHex(
      realisticMix(
        { color: hexToRgb(c1), ratio: c1R / (c1R + c2R) },
        { color: hexToRgb(c2), ratio: c2R / (c1R + c2R) }
      )
    );
  }, [c1, c1R, c2, c2R]);

  return (
    <div className="text-2xl">
      <div className="flex gap-4 items-center">
        <ColorPicker onColorChange={setC1} />
        <div className="flex gap-2">
          <div onClick={() => setC1R((prev) => prev - 1)}>-</div>
          <p>{c1R}</p>
          <div onClick={() => setC1R((prev) => prev + 1)}>+</div>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <ColorPicker onColorChange={setC2} />
        <div className="flex gap-2">
          <div onClick={() => setC2R((prev) => prev - 1)}>-</div>
          <p>{c2R}</p>
          <div onClick={() => setC2R((prev) => prev + 1)}>+</div>
        </div>
      </div>
      <div
        className="h-16 w-16 rounded-full"
        style={{ backgroundColor: mixed }}
      />
      <div
        className="h-16 w-16 rounded-full"
        style={{ backgroundColor: realMixed }}
      />
      <p>{c1}</p>
      <p>{c2}</p>
      <p>{mixed}</p>
      <p>{realMixed}</p>
      <p>{rgbToSpectrum(hexToRgb("#ffe8e4")).join(", ")}</p>
      <p>
        {rgbToHex(spectrumToRgb(Array.from({ length: 31 }).map((e) => 0.81)))}
      </p>
    </div>
  );
}
