const router = require('express').Router();
const postController = require('../controllers/postController');

const auth = require('../middleware/verifyToken');

/**
 * @description 1. fetch all post
 * @endpoint http://localhost:5000/post
 */
router.get('/posts', postController.allPosts);

/**
 * @description 1. create a new post
 * @endpoint http://localhost:5000/post/create
 */
router.post('/create', postController.create);

/**
 * @description 1. like a post
 * @endpoint http://localhost:5000/post/like
 */
router.post('/like', auth.verifyToken, postController.likePost);

/**
 * @description 1. delete a post
 * @endpoint http://localhost:5000/post/delete
 */
router.delete('/delete/:postId', postController.deletePost);

module.exports = router;
