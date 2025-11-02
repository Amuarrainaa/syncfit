import withPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';

const config = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
    turbo: true
  },
  typescript: {
    ignoreBuildErrors: false
  },
  eslint: {
    ignoreDuringBuilds: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  }
};

export default withPWA({
  dest: 'public',
  disable: !isProd,
  register: true,
  skipWaiting: true
})(config);
