'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash('admin', 10);

    return queryInterface.bulkInsert('User', [
      {
        name: 'admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Users', {
      email: 'admin@gmail.com'
    });
  }
};