'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('User', 'bio', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('User', 'expertise', {
      type: Sequelize.JSON,
      allowNull: true
    });

    await queryInterface.addColumn('User', 'experience', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('User', 'education', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('User', 'socialLinks', {
      type: Sequelize.JSON,
      allowNull: true
    });

    await queryInterface.addColumn('User', 'phoneNumber', {
      type: Sequelize.STRING(20),
      allowNull: true
    });

    await queryInterface.addColumn('User', 'profileImage', {
      type: Sequelize.STRING(255),
      allowNull: true
    });

    await queryInterface.addColumn('User', 'instructorStatus', {
      type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      allowNull: true
    });

    await queryInterface.addColumn('User', 'instructorRequestedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('User', 'instructorApprovedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('User', 'rejectionReason', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('User', 'bio');
    await queryInterface.removeColumn('User', 'expertise');
    await queryInterface.removeColumn('User', 'experience');
    await queryInterface.removeColumn('User', 'education');
    await queryInterface.removeColumn('User', 'socialLinks');
    await queryInterface.removeColumn('User', 'phoneNumber');
    await queryInterface.removeColumn('User', 'profileImage');
    await queryInterface.removeColumn('User', 'instructorStatus');
    await queryInterface.removeColumn('User', 'instructorRequestedAt');
    await queryInterface.removeColumn('User', 'instructorApprovedAt');
    await queryInterface.removeColumn('User', 'rejectionReason');
  }
};