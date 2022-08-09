/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/auth/check-in',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
