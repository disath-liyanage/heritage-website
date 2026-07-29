/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gjgfkvdusrumcucgzrtt.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/gallery/**',
      },
    ],
  },
};

export default nextConfig;