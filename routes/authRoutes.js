const router = require('express').Router();
const authController = require('../controllers/authontroller');
const userController = require('../controllers/userController');

/**
 * @middleware
 */

const saveImage = require('../middleware/file-upload');

/**
 * @description 1. create a new user then login user
 * @endpoint http://localhost:2727/auth/signup
 */
router.post('/register', saveImage.single('image'), authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/is-loggedin', authController.isLogedIn);

router.get('/all', userController.getAllUsers);

module.exports = router;
