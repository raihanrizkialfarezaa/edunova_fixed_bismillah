const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Lesson', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    videoUrl: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    videoPublicId: { // field for Cloudinary public_id
      type: DataTypes.STRING(500),
      allowNull: true
    },
    youtubeUrl: { //YouTube video URL as alternative
      type: DataTypes.STRING(500),
      allowNull: true
    },
    videoType: { //to identify video source
      type: DataTypes.ENUM('CLOUDINARY', 'YOUTUBE'),
      allowNull: true,
      defaultValue: null
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Section',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Lesson',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "Lesson_sectionId_fkey",
        using: "BTREE",
        fields: [
          { name: "sectionId" },
        ]
      },
    ]
  });
};
