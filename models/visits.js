const { DataTypes } = require("sequelize");
const db = require("./connectionDb");

const Visit = db.sequelize.define("visits", {
	id: {
		type: DataTypes.STRING(256),
		primaryKey: true,
	},
	ip: {
		type: DataTypes.STRING(256),
	},
});

module.exports = Visit;
