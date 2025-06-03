require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(path.resolve(__dirname, process.env.SSL_CA_PATH)),
        rejectUnauthorized: false
      }
    }
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Berhasil terhubung ke database.');
  } catch (error) {
    console.error('❌ Gagal terhubung ke database:', error.message);
  }
}

testConnection();