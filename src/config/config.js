require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: 'ecommerce_essentials_dev',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};