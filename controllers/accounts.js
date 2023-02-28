const { response } = require("express");
const Account = require("../models/account");

const getAccounts = async (req, res = response) => {
	try {
		const accounts = await Account.findAll({
			attributes: {
				exclude: ["createdAt", "updatedAt"],
			},
		});

		res.status(200).json({
			ok: true,
			accounts,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
	}
};

module.exports = {
	getAccounts,
};
