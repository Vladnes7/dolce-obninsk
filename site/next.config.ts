import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Сборка для VPS: самодостаточный сервер в .next/standalone (служба dolce на сервере sites).
  output: "standalone",
  cacheComponents: true,
  // Просмотр dev-сервера с телефона в домашней Wi‑Fi (http://192.168.x.x:3030). На сервер не влияет.
  allowedDevOrigins: ["192.168.*.*"],
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
