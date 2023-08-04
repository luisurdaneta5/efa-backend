const { DataTypes } = require("sequelize");
const db = require("./connectionDb");

const Refill = db.sequelize.define("refills", {
    id: {
        type: DataTypes.STRING(256),
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING(256),
    },
    bank: {
        type: DataTypes.STRING(256),
    },
    amount: {
        type: DataTypes.STRING(256),
    },
    conversion: {
        type: DataTypes.STRING(256),
    },
    name: {
        type: DataTypes.STRING(256),
    },
    reference: {
        type: DataTypes.STRING(256),
    },
    date: {
        type: DataTypes.DATE(),
    },
    voucher: {
        type: DataTypes.TEXT(),
    },
    status: {
        type: DataTypes.INTEGER(),
    },
    tasa: {
        type: DataTypes.STRING(256),
    },
});

module.exports = Refill;
