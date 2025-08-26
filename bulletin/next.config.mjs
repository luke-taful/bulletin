/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
    return [
      {
        source: '/blueprint',
        destination: 'http://localhost:5000/blueprint',
      },
      {
        source: '/login',
        destination: 'http://localhost:5000/login',
      },
      {
        source: '/register',
        destination: 'http://localhost:5000/register',
      }
    ]
  }
};
export default nextConfig;
