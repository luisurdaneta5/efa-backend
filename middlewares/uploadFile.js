const multer = require("multer");
const path = require("path");
const { v4: uuid } = require("uuid");

const uploadFile = (term, destination) => {
	const storage = multer.diskStorage({
		destination: destination,
		filename: function (req, file, cb) {
			const fileExtension = path.extname(file.originalname);

			const fileName = uuid() + fileExtension;
			cb(null, fileName);
		},
	});

	const upload = multer({
		storage,
		fileFilter: (req, file, cb) => {
			const acceptedExtensions = [".jpg", ".png"];
			const fileExtension = path.extname(file.originalname);
			const isAnAcceptedExtension = acceptedExtensions.includes(fileExtension);

			if (isAnAcceptedExtension) {
				cb(null, true);
			} else {
				cb(null, false);
			}
		},
	}).single(term);

	return upload;
};

module.exports = uploadFile;
