const { DataTypes } = require("sequelize");
const db = require("./connectionDb");

const ShoppingCart = db.sequelize.define("shoppingcarts", {
	id: {
		type: DataTypes.STRING(256),
		primaryKey: true,
	},
	userId: {
		type: DataTypes.STRING(256),
	},
	productId: {
		type: DataTypes.STRING(256),
	},
	count: {
		type: DataTypes.INTEGER(),
	},
});

module.exports = ShoppingCart;
