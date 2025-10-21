/** @type {import('next').NextConfig} */
const nextConfig = {// Ingat, Anda sudah punya ini dari sebelumnya:
  eslint: {
    // ⛔️ Lint errors/warnings tidak akan menghentikan next build
    ignoreDuringBuilds: true,
  },};

export default nextConfig;
