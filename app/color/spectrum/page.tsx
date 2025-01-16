"use client";

import { rgbToHex, xyzToRgb } from "@/utils/color/color-space";
import { SPECTRUM_DATA } from "@/utils/color/spectrum-data";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { use } from "react";

const SpectrumGraph = dynamic(() => import("../components/spectrum-graph"), {
  ssr: false,
});

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ paint?: number }>;
}) {
  const selected = use(searchParams).paint ?? 0;
  const data = SPECTRUM_DATA[selected];
  const router = useRouter();
  const rgb = xyzToRgb(data.xyz);
  const hex = rgbToHex(rgb);

  return (
    <div>
      <header className="my-4">
        <h1 className="text-xl font-bold">색상 스펙트럼 관찰</h1>
      </header>
      <main>
        <section className="flex gap-4 justify-between">
          <div className="py-4">
            <div
              className="w-20 h-20 rounded-lg grid place-items-center shadow-lg"
              style={{ backgroundColor: hex }}
            ></div>
            <div className="mt-4 text-lg">
              <p>hex: {hex}</p>
              <p>
                rgb: ({rgb.r}, {rgb.g}, {rgb.b})
              </p>
              <p>
                xyz: ({data.xyz.x.toFixed(3)}, {data.xyz.y.toFixed(3)},{" "}
                {data.xyz.z.toFixed(3)})
              </p>
            </div>
          </div>
          <SpectrumGraph spectrum={data.spectrum} color={hex} />
        </section>
        <section className="py-4">
          <h2 className="font-semibold">더 많은 색상의 스펙트럼 관찰</h2>
          <div className="flex gap-2 flex-wrap h-[500px] overflow-y-auto border p-4 rounded mt-2">
            {SPECTRUM_DATA.map((spec, index) => (
              <div
                key={index}
                onClick={() => router.push(`/color/spectrum?paint=${index}`)}
                className="w-6 h-6 rounded-full cursor-pointer"
                style={{ backgroundColor: rgbToHex(xyzToRgb(spec.xyz)) }}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
