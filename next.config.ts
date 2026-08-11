import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/Asset/**",
      },
    ],
  },
};

export default nextConfig;
