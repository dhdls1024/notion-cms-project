import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // next/image 외부 이미지 도메인 허용
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      // Notion 첨부 이미지 (파일 업로드)
      {
        protocol: "https",
        hostname: "files.notion.so",
      },
      // Notion S3 버킷 이미지
      {
        protocol: "https",
        hostname: "*.s3.us-west-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig
