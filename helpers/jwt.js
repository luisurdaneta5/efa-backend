const jwt = require("jsonwebtoken");

const generarJWT = (uid, name, type) => {
	return new Promise((resolve, reject) => {
		const payload = {
			uid,
			name,
			type,
		};

		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			{
				expiresIn: "2h",
			},
			(err, token) => {
				if (err) {
					console.log(err);
					reject("Error al generar el token");
				} else {
					resolve(token);
				}
			}
		);
	});
};

module.exports = {
	generarJWT,
};
