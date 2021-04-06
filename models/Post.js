const mongoose = require('mongoose');
const Comment = require('./Comment');

const postSchema = new mongoose.Schema({
	content: String,
	likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
	author: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
	comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
	createdAt: { type: Date, default: Date.now },
});

postSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

// prettier-ignore
postSchema.pre('deleteOne',{ document: true, query: true }, async function () {
		// const doc = await this.model.findOne(this.getFilter());
		console.log(this.getFilter());
		await Comment.deleteMany({ post: this.getFilter()._id });
	}
);

// postSchema.post('init', function (doc) {
// 	console.log('%s has been initialized from the db', doc._id);
// });
// postSchema.post('validate', function (doc) {
// 	console.log('%s has been validated (but not saved yet)', doc._id);
// });
// postSchema.post('save', function (doc) {
// 	console.log('%s has been saved', doc._id);
// });
postSchema.post('remove', function (doc) {
	console.log('%s has been removed', doc._id);
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
