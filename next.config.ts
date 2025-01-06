import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*", // 모든 경로에 적용
        headers: [
          {
            key: "Permissions-Policy",
            value: "accelerometer=()", // accelerometer 차단
          },
        ],
      },
    ];
  },
};

export default nextConfig;
