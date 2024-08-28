/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'via.placeholder.com',
      'firebasestorage.googleapis.com',
      'www.w3schools.com',
      '1000logos.net',
      'imgs.search.brave.com',
      'lh3.googleusercontent.com',
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true, // Set to false if you want a temporary redirect
      },
    ];
  },
};

export default nextConfig;
