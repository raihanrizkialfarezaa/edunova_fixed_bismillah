'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Lesson', 'videoPublicId', {
      type: Sequelize.STRING(191),
      allowNull: true,
      after: 'videoUrl'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Lesson', 'videoPublicId');
  }
};
