const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const Helper = require('../utils/helper');
const create = async (req, res) => {
	const { content, userId, postId } = req.body;
	// console.log(req.body);
	// const token = req.cookies.token;

	// const email = Helper.verifyJWTtoken(token)

	// const user = User.findOne({email});

	const comment = new Comment({
		content: content,
		author: userId,
		post: postId,
	});

	const savedComment = await comment.save();

	// append comment id to post comments array and save post
	const post = await Post.findById(postId);
	post.comments.push(comment);
	post.save();

	const populatedComment = await savedComment
		.populate('author', ['name', 'image'])
		.execPopulate();

	res.json(populatedComment);
};

module.exports = {
	create,
};
