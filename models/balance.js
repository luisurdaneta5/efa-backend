const { DataTypes } = require("sequelize");
const db = require("./connectionDb");
const User = require("./user");

const Balance = db.sequelize.define("balances", {
	id: {
		type: DataTypes.STRING(256),
		primaryKey: true,
	},
	userId: {
		type: DataTypes.STRING(256),
		references: {
			model: User,
			key: "userId",
		},
	},
	amount: {
		type: DataTypes.FLOAT,
	},
});

module.exports = Balance;
