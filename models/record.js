const { DataTypes } = require("sequelize");
const db = require("./connectionDb");

const Record = db.sequelize.define("records", {
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
});

module.exports = Record;
