const Post = require('../models/Post');
const User = require('../models/User');
const Helper = require('../utils/helper');

const allPosts = async (req, res) => {
	// prettier-ignore
	const posts = await Post.find({})
		.sort({ createdAt: 'desc' })
		.populate('author', ['name', 'image'])
		.populate({
			path: 'comments',
			options: { sort: { createdAt: -1 }, populate: { path: 'author' } },
		});

	res.json(posts);
};

const create = async (req, res) => {
	const token = req.headers['authorization'];
	const { content } = req.body;

	console.log(token);

	const email = Helper.verifyJWTtoken(token);

	const user = await User.findOne({ email });

	const post = new Post({
		content,
		author: user.id,
	});
	const savedPost = await post.save();

	user.posts.push(savedPost);
	await user.save();

	const populatedPost = await savedPost
		.populate('author', ['name', 'image'])
		.execPopulate();

	// console.log(populatedPost);

	res.json(populatedPost);
};

const likePost = async (req, res) => {
	const { userId, postId } = req.body;

	const post = await Post.findById(postId);
	console.log(post.likes);

	if (post.likes.includes(userId)) {
		post.likes.pull(userId);
		console.log(post.likes);
	} else {
		post.likes.push(userId);
	}
	await post.save();

	res.json({ message: 'succsess' });
};

const deletePost = async (req, res, next) => {
	const { postId } = req.params;

	// console.log(req.params);
	// return res.json({ postId });

	let post;
	try {
		post = await Post.deleteOne({ _id: postId });
		console.log(post);
	} catch (error) {
		return next(new HttpError(error.message, 500));
	}

	res.json({ message: 'success' });
};

module.exports = { allPosts, create, likePost, deletePost };
