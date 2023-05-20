var path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.experiments = config.experiments || {};
    config.experiments.topLevelAwait = true;
    const loaders = config.module.rules.find((rule) => Array.isArray(rule.oneOf));
    loaders.oneOf.unshift({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home/read",
        permanent: true,
      },
    ];
  },
  env: {
    POSTGRES_HOST:
      "postgresql://admin1:12345678@test-123-instance-1.cwzxl0huyaog.us-east-1.rds.amazonaws.com:5432/goodreads",
  },
};

module.exports = nextConfig;
