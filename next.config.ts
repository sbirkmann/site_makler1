import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Platzhalter-Bildquelle fuer die Demo-Daten.
    // Erweiterungspunkt: Bei Umstellung auf lokale Uploads oder Object Storage
    // hier den entsprechenden Host ergaenzen bzw. ersetzen.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
