const { DataTypes } = require("sequelize");
const db = require("./connectionDb");

const Slider = db.sequelize.define("sliders", {
	id: {
		type: DataTypes.STRING(256),
		primaryKey: true,
	},
	url: {
		type: DataTypes.TEXT,
	},
});

module.exports = Slider;
