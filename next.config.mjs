/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/discord',
          destination: 'https://discord.gg/GwhpAuekw6',
          permanent: true,
        },
      ]
    },
  }
  
  export default nextConfig;
