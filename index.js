const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models/connectionDb");
require("dotenv").config();

//Acceso a Express
const app = express();

//Middelwares
app.use(cors());

//Directorio Publico
app.use(express.static("public"));
app.use(express.json());

//Rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/users", require("./routes/users"));

//Servidor
app.listen(process.env.PORT, () => {
	console.log(`Servidor corriendo en puerto ${process.env.PORT}`);

	sequelize
		.authenticate()
		.then(() => {
			console.log(
				"La conexión a la base de datos se ha establecido correctamente"
			);
		})
		.catch((err) => {
			console.log("No se ha podido conectar a la base de datos:", err);
		});
});
