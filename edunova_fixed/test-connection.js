const sequelize = require('./db');
sequelize.authenticate()
  .then(() => console.log('Koneksi sukses!'))
  .catch(err => console.error('Koneksi gagal:', err));