const { DataTypes } = require("sequelize");
const db = require("./connectionDb");

const Sale = db.sequelize.define("sales", {
	id: {
		type: DataTypes.STRING(256),
		primaryKey: true,
	},
	productId: {
		type: DataTypes.STRING(256),
	},
	cant: {
		type: DataTypes.INTEGER(),
	},
	sale_date: {
		type: DataTypes.DATE(),
	},
});

module.exports = Sale;
