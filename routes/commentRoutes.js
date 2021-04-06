const router = require('express').Router();
const commentController = require('../controllers/commentController');

/**
 * @middleware
 */

/**
 * @description 1. create a new user then login user
 * @endpoint http://localhost:2727/auth/signup
 */

router.post('/create', commentController.create);

module.exports = router;
