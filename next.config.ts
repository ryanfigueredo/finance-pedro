import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  matcher: ["/((?!_next|favicon.ico|images|api/public).*)"],
};

export default nextConfig;
