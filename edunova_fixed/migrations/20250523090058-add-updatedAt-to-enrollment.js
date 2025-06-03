'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Enrollment', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
      after: 'createdAt' 
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Enrollment', 'updatedAt');
  }
};