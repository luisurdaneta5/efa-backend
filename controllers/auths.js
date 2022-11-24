const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const bycrypt = require("bcrypt");
const User = require("../models/user");
const { generarJWT } = require("../helpers/jwt");

const createUser = async (req, res = response) => {
	const body = req.body;

	try {
		let user = await User.findOne({
			where: {
				email: body.email,
			},
		});

		if (user) {
			res.status(404).json({
				ok: false,
				msg: "Disculpe, ya existe un usuario con ese correo",
			});
		} else {
			const salt = bycrypt.genSaltSync();
			const hash = bycrypt.hashSync(body.password, salt);

			const data = {
				...body,
				id: uuidv4(),
				password: hash,
			};

			user = new User(data);
			user.save();

			res.status(200).json({
				ok: true,
				user,
			});
		}
	} catch (error) {
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const setLogin = async (req, res = response) => {
	const body = req.body;

	try {
		const user = await User.findOne({
			where: {
				email: body.email,
			},
		});

		if (user) {
			const validPassword = bycrypt.compareSync(
				body.password,
				user.password
			);

			if (!validPassword) {
				res.status(400).json({
					ok: true,
					msg: "Contaseña incorrecta",
				});
			} else {
				const token = await generarJWT(user.id, user.name, user.type);

				res.status(200).json({
					ok: true,
					uid: user.id,
					name: user.name,
					type: user.type,
					token,
				});
			}
		} else {
			res.status(404).json({
				ok: false,
				msg: "Este usuario no existe",
			});
		}
	} catch (error) {
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
		console.log(error);
	}
};

const renewToken = async (req, res = response) => {
	const { uid, name, type } = req.body;

	const token = await generarJWT(uid, name, type);

	res.status(200).json({
		ok: true,
		token,
	});
};

module.exports = {
	createUser,
	setLogin,
	renewToken,
};
