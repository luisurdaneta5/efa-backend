const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT = (req, res = response, next) => {
	const token = req.header("x-token");

	if (!token) {
		return res.status(401).json({
			ok: false,
			message: "No hay token",
		});
	} else {
		try {
			const { uid, name, type } = jwt.verify(
				token,
				process.env.JWT_SECRET
			);

			req.uid = uid;
			req.name = name;
			req.type = type;
		} catch (error) {
			console.log(error);
			return res.status(401).json({
				ok: false,
				message: "Error al validar el token",
			});
		}
		next();
	}
};

module.exports = {
	validarJWT,
};
