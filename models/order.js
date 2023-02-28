const { DataTypes } = require("sequelize");
const db = require("./connectionDb");

const Order = db.sequelize.define("orders", {
	id: {
		type: DataTypes.STRING(256),
		primaryKey: true,
	},
	userId: {
		type: DataTypes.STRING(256),
	},
	products: {
		type: DataTypes.TEXT,
	},
	status: {
		type: DataTypes.INTEGER,
	},
	name: {
		type: DataTypes.STRING(256),
	},
	dni: {
		type: DataTypes.STRING(256),
	},
	email: {
		type: DataTypes.STRING(256),
	},
	phone: {
		type: DataTypes.STRING(256),
	},
	address: {
		type: DataTypes.STRING(256),
	},
	note: {
		type: DataTypes.TEXT,
	},
	delivery_date: {
		type: DataTypes.DATE,
	},
	total: {
		type: DataTypes.STRING(100),
	},
	discount: {
		type: DataTypes.STRING(100),
	},
});

module.exports = Order;
