export default () => ({
  database: {
    url: process.env.DB_URL || process.env.DB_URI,
    name: process.env.DB_NAME || 'blog_api',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-here',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  nodeEnv: process.env.NODE_ENV || 'development',
});
