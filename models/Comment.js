const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	content: String,
	author: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
	post: { type: mongoose.Types.ObjectId, required: true, ref: 'Post' },
	createdAt: { type: Date, default: Date.now },
});

commentSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
