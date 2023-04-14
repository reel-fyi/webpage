module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://reel.fyi/',
        permanent: true,
      },
    ]
  }
}
