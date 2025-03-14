import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enable React Strict Mode for better debugging
  compiler: {
    // Enable styled-components support (optional)
    styledComponents: true,
  },
};

export default nextConfig;
