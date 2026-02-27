import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // next/image 외부 이미지 도메인 허용
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig
