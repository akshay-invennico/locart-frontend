/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },

      {
        protocol: "https",
        hostname: "invennico-dev.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "project-locart-staging.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "locart-staging-development.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],

    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
