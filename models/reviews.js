const { DataTypes } = require("sequelize");
const db = require("./connectionDb");

const Review = db.sequelize.define("reviews", {
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
	orderId: {
		type: DataTypes.STRING(256),
	},
	comment: {
		type: DataTypes.TEXT(),
	},
	rating: {
		type: DataTypes.STRING(10),
	},
	status: {
		type: DataTypes.INTEGER(),
	},
});

module.exports = Review;
