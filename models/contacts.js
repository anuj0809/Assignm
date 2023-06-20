const { DataTypes } = require('sequelize');
const sequelize = require('../integration/sequelize');
const {contactVariable} = require('../utils/variable')

const Contacts = sequelize.define('Contacts', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    linkedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    linkPrecedence: {
        type: DataTypes.ENUM(contactVariable.LINKPRECEDENCE_PRIMARY, contactVariable.LINKPRECEDENCE_SECONDARY),
        allowNull: false,
    },
    // Timestamps
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },

    // Soft deletes
    deletedAt: { type: DataTypes.DATE, allowNull: true },

},
    {
        // Enable timestamps and soft deletes
        timestamps: true,
        paranoid: true,
    });

module.exports = Contacts;