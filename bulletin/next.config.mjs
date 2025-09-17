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
      },
      {
        source: '/images',
        destination: 'http://localhost:5000/images'
      },
      {
        source: '/deleteImage',
        destination: 'http://localhost:5000/deleteImage'
      }
    ]
  }
};
export default nextConfig;
