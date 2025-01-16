import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SpectrumGraphProps {
  spectrum: number[];
  color?: string;
}

const SpectrumGraph: React.FC<SpectrumGraphProps> = ({ spectrum, color }) => {
  const data = spectrum.map((spec, index) => ({
    waveLength: 400 + 10 * index,
    reflectance: spec,
  }));

  return (
    <AreaChart
      width={600}
      height={300}
      data={data}
      margin={{ top: 20, right: 30, bottom: 5, left: 20 }}
    >
      <defs>
        <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.8} />
          <stop offset="95%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="waveLength" className="text-sm" />
      <YAxis className="text-sm" />
      <Tooltip />
      <Legend />
      <Area
        type="monotone"
        dataKey="reflectance"
        stroke={color}
        fillOpacity={1}
        fill="url(#areaColor)"
      />
    </AreaChart>
  );
};

export default SpectrumGraph;
