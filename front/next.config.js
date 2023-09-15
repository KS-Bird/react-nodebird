const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  compress: true,
  webpack(config) {
    const prod = process.env.NODE_ENV === 'production';
    return {
      ...config,
      mode: prod ? 'production' : 'development',
      // hidden-source-map : 소스코드 숨겨짐
      devtool: prod ? 'hidden-source-map' : 'eval-source-map',
    };
  },
});
