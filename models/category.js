const { DataTypes } = require("sequelize");
const db = require("./connectionDb");

const Category = db.sequelize.define("categories", {
	id: {
		type: DataTypes.STRING(256),
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING(256),
	},
	status: {
		type: DataTypes.INTEGER,
	},
});

module.exports = Category;
