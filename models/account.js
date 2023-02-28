const { DataTypes } = require("sequelize");
const db = require("./connectionDb");

const Account = db.sequelize.define("accounts", {
	id: {
		type: DataTypes.STRING(256),
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING(256),
	},
	account: {
		type: DataTypes.STRING(256),
	},
	titular: {
		type: DataTypes.STRING(256),
	},
	dni: {
		type: DataTypes.STRING(256),
	},
	img: {
		type: DataTypes.TEXT,
	},
});

module.exports = Account;
