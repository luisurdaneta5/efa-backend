var ImageKit = require("imagekit");
var fs = require("fs");

const uploadImageKit = async (file) => {
	console.log(file);

	var imagekit = new ImageKit({
		publicKey: "public_5AYTuMmeJiLHlRar97+YnJSgIAA=",
		privateKey: "private_EmWlx8Lt7mpNSXwN19Ha1gZ8coU=",
		urlEndpoint: "https://ik.imagekit.io/luisurdaneta5",
	});

	fs.readFile(file.path, function (err, data) {
		if (err) throw err;
		console.log(data); // Fail if the file can't be read.
		imagekit.upload(
			{
				file: data, //required
				fileName: file.filename, //required
				tags: ["tag1", "tag2"],
			},
			function (error, result) {
				if (error) console.log(error);
				else console.log(result);
			}
		);
	});
};

module.exports = uploadImageKit;
