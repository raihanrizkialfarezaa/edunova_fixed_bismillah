'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Payment', 'paymentMethod', {
      type: Sequelize.ENUM('CREDIT_CARD', 'BANK_TRANSFER', 'E_WALLET'),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Payment', 'paymentMethod', {
      type: Sequelize.ENUM('CREDIT_CARD', 'BANK_TRANSFER', 'E_WALLET'),
      allowNull: false
    });
  }
};
