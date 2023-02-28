const { DataTypes } = require("sequelize");
const db = require("./connectionDb");

const Product = db.sequelize.define("products", {
	id: {
		type: DataTypes.STRING(256),
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING(256),
	},
	category: {
		type: DataTypes.STRING(256),
	},
	description: {
		type: DataTypes.STRING(256),
	},
	brand: {
		type: DataTypes.STRING(256),
	},
	stock: {
		type: DataTypes.FLOAT,
	},
	cost: {
		type: DataTypes.FLOAT,
	},
	profit: {
		type: DataTypes.FLOAT,
	},
	discount: {
		type: DataTypes.FLOAT,
	},
	price: {
		type: DataTypes.STRING(200),
	},
	img: {
		type: DataTypes.STRING(256),
	},
	status: {
		type: DataTypes.TINYINT(1),
	},
});

module.exports = Product;
