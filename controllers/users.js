const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { Op } = require("sequelize");
const Balance = require("../models/balance");
const Avatar = require("../models/avatar");
const { generarJWT } = require("../helpers/jwt");

// const createUser = async (req, res = response) => {
// 	const body = req.body;

// 	try {
// 		let user = await User.findOne({
// 			where: {
// 				email: body.email,
// 			},
// 		});

// 		if (!user) {
// 			const salt = bcrypt.genSaltSync();
// 			const hash = bcrypt.hashSync(body.password, salt);

// 			const data = {
// 				...body,
// 				id: uuidv4(),
// 				password: hash,
// 			};

// 			user = new User(data);
// 			user.save();

// 			const balanceData = {
// 				id: uuidv4(),
// 				userId: user.id,
// 				amount: 0,
// 			};

// 			const balance = new Balance(balanceData);
// 			balance.save();

// 			const avatarData = {
// 				id: uuidv4(),
// 				userId: user.id,
// 				avatarUrl: " ",
// 			};

// 			const avatar = new Avatar(avatarData);
// 			avatar.save();

// 			res.status(200).json({
// 				ok: true,
// 				msg: "Usuario creado exitosamente",
// 			});
// 		} else {
// 			res.status(500).json({
// 				ok: false,
// 				msg: "Disculpe, ya existe un usuario con ese correo",
// 			});
// 		}
// 	} catch (error) {
// 		res.status(500).json({
// 			ok: true,
// 			msg: "Ha ocurrido un error inesperado",
// 		});
// 		console.log(error);
// 	}
// };

const updateUser = async (req, res = response) => {
	const body = req.body;
	try {
		let user = await User.findOne({
			where: {
				id: {
					[Op.ne]: body.uid,
				},
				email: body.email,
			},
		});

		if (!user) {
			if (body.password !== "") {
				const salt = bcrypt.genSaltSync();
				const hash = bcrypt.hashSync(body.password, salt);

				await User.update(
					{
						...body,
						password: hash,
					},
					{
						where: {
							id: body.uid,
						},
					}
				);

				res.status(200).json({
					ok: true,
					msg: "Usuario actualizado correctamente",
				});
			} else {
				const userfound = await User.findOne({
					where: {
						id: body.uid,
					},
				});

				userfound.update({
					...body,
					password: userfound.password,
				});

				res.status(200).json({
					ok: true,
					msg: "Usuario actualizado correctamente",
				});
			}
		} else {
			res.status(500).json({
				ok: false,
				msg: "email",
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

const getUsers = async (req, res = response) => {
	const { uid, page, size, query } = req.query;

	try {
		if (uid) {
			const user = await User.findOne({
				where: {
					id: uid,
				},
				attributes: {
					exclude: ["id", "password", "createdAt", "updatedAt"],
				},
			});

			res.status(200).json({
				ok: true,
				user,
			});
		} else {
			const term = query.trim().toLowerCase();
			const users = await User.findAndCountAll({
				include: [
					{
						model: Avatar,
						attributes: {
							exclude: ["userId", "id", "createdAt", "updatedAt"],
						},
					},
					{
						model: Balance,
						attributes: {
							exclude: ["id", "userId", "createdAt", "updatedAt"],
						},
					},
				],
				attributes: {
					exclude: ["password", "createdAt", "updatedAt"],
				},
				limit: parseInt(size),
				offset: parseInt(page * size),

				where: {
					[Op.or]: [
						{
							name: {
								[Op.like]: "%" + term + "%",
							},
						},
						{
							email: {
								[Op.like]: "%" + term + "%",
							},
						},
					],
				},
			});

			res.status(200).json({
				ok: true,
				users,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
	}
};

const deleteUser = async (req, res = response) => {
	const { uid } = req.query;

	try {
		const user = await User.findOne({
			where: {
				id: uid,
			},
		});

		const balance = await Balance.findOne({
			where: {
				userId: uid,
			},
		});

		const avatar = await Avatar.findOne({
			where: {
				userId: uid,
			},
		});

		const name = user.name;
		user.destroy();
		balance.destroy();
		avatar.destroy();

		res.status(200).json({
			ok: true,
			msg: name,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
	}
};

const updateProfile = async (req, res = response) => {
	const { uid, name, email, phone } = req.body;
	try {
		const user = await User.findOne({
			where: {
				id: uid,
			},
		});

		user.update({
			name,
			email,
			phone,
		});

		res.status(200).json({
			ok: true,
			msg: "Su usuario se ha actualizado correctamente",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
	}
};

const getUser = async (req, res = response) => {
	const { uid } = req.query;

	try {
		const user = await User.findOne({
			where: {
				id: uid,
			},
			attributes: {
				exclude: ["id", "type", "password", "createdAt", "updatedAt"],
			},
			include: [
				{
					model: Avatar,
					attributes: {
						exclude: ["userId", "id", "createdAt", "updatedAt"],
					},
				},
			],
		});

		const balance = await Balance.findOne({
			where: {
				userId: uid,
			},
		});

		res.status(200).json({
			ok: true,
			name: user.name,
			email: user.email,
			phone: user.phone,
			avatar: user.avatar.avatarUrl,
			balance: balance.amount,
			// msg: "Su usuario se ha actualizado correctamente",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
	}
};

const changePassword = async (req, res = response) => {
	const { uid, oldPassword, newPassword } = req.body;

	try {
		const user = await User.findByPk(uid);

		const validation = bcrypt.compareSync(oldPassword, user.password);

		if (validation) {
			const salt = bcrypt.genSaltSync();
			const hash = bcrypt.hashSync(newPassword, salt);

			user.update({
				...user,
				password: hash,
			});

			res.status(200).json({
				ok: true,
				msg: "Su contraseña ha sido actualizada correctamente",
			});
		} else {
			res.status(500).json({
				ok: true,
				msg: "Su contraseña actual no coincide",
			});
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
	}
};

const changeAvatar = async (req, res = response) => {
	const body = req.body;
	const file = req.file;

	try {
		const avatar = await Avatar.findOne({
			where: {
				userId: body.uid,
			},
		});

		const data = {
			...avatar,
			avatarUrl: body.avatar,
		};

		avatar.update(data);

		res.status(200).json({
			ok: true,
			url: avatar.avatarUrl,
			msg: "Su foto de pefil ha sido actualizada!",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: true,
			msg: "Ha ocurrido un error inesperado",
		});
	}
};

const usersCount = async (req, res = response) => {
	try {
		const users = await User.count();

		res.status(200).json({
			ok: true,
			users,
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
	updateUser,
	getUsers,
	deleteUser,
	updateProfile,
	getUser,
	changePassword,
	changeAvatar,
	usersCount,
};
