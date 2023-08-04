const { DataTypes } = require("sequelize");
const db = require("./connectionDb");

const Email = db.sequelize.define("emails_notifications", {
    id: {
        type: DataTypes.STRING(256),
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING(256),
    },

    notifications: {
        type: DataTypes.STRING(256),
    },
});

module.exports = Email;
