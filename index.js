const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models/connectionDb");
const path = require("path");
require("./models/asociations");
require("dotenv").config();

//Acceso a Express
const app = express();

//Middelwares
app.use(cors());

//Directorio Publico
app.use(express.static("public"));
app.use(express.json());

//acceso a avatars
app.use("/uploads/avatars", express.static(path.join(__dirname, "/uploads/avatars")));

//acceso a categorias
app.use("/uploads/icons/categories", express.static(path.join(__dirname, "/uploads/icons/categories")));

//acceso a productos
app.use("/uploads/products", express.static(path.join(__dirname, "/uploads/products")));

//acceso a banners
app.use("/uploads/banners", express.static(path.join(__dirname, "/uploads/banners")));

//Rutas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/favorites", require("./routes/favorites"));
app.use("/api/accounts", require("./routes/accounts"));
app.use("/api/refills", require("./routes/refills"));
app.use("/api/shoppingcarts", require("./routes/shoppingcarts"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/records", require("./routes/records"));

//Servidor
app.listen(process.env.PORT, () => {
	console.log(`Servidor corriendo en puerto ${process.env.PORT}`);

	sequelize
		.authenticate()
		.then(() => {
			console.log("La conexión a la base de datos se ha establecido correctamente");
		})
		.catch((err) => {
			console.log("No se ha podido conectar a la base de datos:", err);
		});
});
