module.exports = {
  images: {
    domains: ['rexnet-listings.s3.eu-central-1.amazonaws.com']
  },
  pageExtensions: ['tsx'],
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push(
      ...[
        {
          test: /\.svg$/,
          use: '@svgr/webpack'
        }
      ]
    );
    return config;
  }
};
