const Comment = require('../models/Comment');
const Post = require('../models/Post');

const createComment = async ({ content, userId, postId }) => {
	const comment = new Comment({
		content: content,
		author: userId,
		post: postId,
	});

	const savedComment = await comment.save();

	// append comment id to post comments array and save post
	const post = await Post.findById(postId);
	post.comments.push(comment);
	await post.save();

	const populatedComment = await savedComment
		.populate('author', ['name', 'image'])
		.execPopulate();

	return populatedComment;
};

module.exports = {
	createComment,
};
