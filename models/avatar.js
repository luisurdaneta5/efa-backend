const { DataTypes } = require("sequelize");
const db = require("./connectionDb");

const Avatar = db.sequelize.define("avatars", {
	id: {
		type: DataTypes.STRING(256),
		primaryKey: true,
	},
	userId: {
		type: DataTypes.STRING(256),
	},
	avatarUrl: {
		type: DataTypes.BLOB(),
	},
});

module.exports = Avatar;
