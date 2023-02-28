const { DataTypes } = require("sequelize");
const db = require("./connectionDb");

const Setting = db.sequelize.define("settings", {
	id: {
		type: DataTypes.STRING(256),
		primaryKey: true,
	},
	address: {
		type: DataTypes.STRING(256),
	},
	email: {
		type: DataTypes.STRING(256),
	},
	description: {
		type: DataTypes.STRING(256),
	},
	facebook: {
		type: DataTypes.STRING(256),
	},
	twitter: {
		type: DataTypes.STRING(256),
	},
	instagram: {
		type: DataTypes.STRING(256),
	},
	whatsapp: {
		type: DataTypes.STRING(256),
	},
	iva: {
		type: DataTypes.STRING(100),
	},
	exchangeRate: {
		type: DataTypes.STRING(100),
	},
	text1: {
		type: DataTypes.STRING(100),
	},
	text2: {
		type: DataTypes.STRING(100),
	},
	statusText: {
		type: DataTypes.TINYINT,
	},
});

module.exports = Setting;
