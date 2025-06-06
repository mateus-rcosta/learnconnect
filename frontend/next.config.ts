import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /* ←­­ adição: liberação de hosts externos p/ <Image> */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        port: "",          // qualquer porta
        pathname: "**",    // qualquer path
      },
      // ➜ se aparecerem outros domínios, adicione novos objetos aqui
      // { protocol: "https", hostname: "cdn.exemplo.com", pathname: "**" },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend:3000/api/:path*", // serviço "backend" no docker-compose
      },
    ];
  },
};

export default nextConfig;
