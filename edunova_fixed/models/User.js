const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: "User_email_key"
    },
    password: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('STUDENT','INSTRUCTOR','ADMIN'),
      allowNull: false
    },
    // New instructor profile fields
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expertise: {
      type: DataTypes.JSON,
      allowNull: true
    },
    experience: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    education: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    socialLinks: {
      type: DataTypes.JSON,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    profileImage: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    instructorStatus: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      allowNull: true
    },
    instructorRequestedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    instructorApprovedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'User',
    timestamps: true,
    paranoid: true,
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
        name: "User_email_key",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
};