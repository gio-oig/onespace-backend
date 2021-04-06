const multer = require('multer');
const { v4: uuid } = require('uuid');

const MIME_TYPE_MAP = {
	'image/png': 'png',
	'image/jpeg': 'jpeg',
	'image/jpg': 'jpg',
};

const fileUpload = multer({
	limits: 50000,
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			// null is the place for error
			cb(null, 'uploads/images');
		},
		filename: (req, file, cb) => {
			// set file extention
			const extension = MIME_TYPE_MAP[file.mimetype];
			// create file name
			cb(null, uuid() + '.' + extension);
		},
	}),
	fileFilter: (req, file, cb) => {
		// check if file type is acceptable or not -> true/false
		const isValid = !!MIME_TYPE_MAP[file.mimetype];
		const error = isValid ? null : new Error('Invalid mime type!');
		cb(error, isValid);
	},
});

module.exports = fileUpload;
