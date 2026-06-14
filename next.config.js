/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["nodemailer"],
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
