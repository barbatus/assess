var path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'pl'],
    defaultLocale: 'en',
  },
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
    AWS_ACCESS_KEY: 'AKIA5WYRG2DEUMORIZXC',
    AWS_SECRET_KEY: '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',
    S3_BUCKET: 'alexgoodreads',
    REDIS_HOST: 'us1-notable-egret-40344.upstash.io',
    REDIS_PWD: 'bf273a32000b42579707c4b3d4f451fd',
  },
  pageExtensions: ['page.tsx', 'page.ts'],
};

module.exports = nextConfig;
