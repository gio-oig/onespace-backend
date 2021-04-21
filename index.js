const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieparser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const socket = require('./socket');

const app = express();
const server = http.createServer(app);
dotenv.config();

const io = require('socket.io')(server, {
	cors: {
		origin: ['http://localhost:8080', 'https://onespace-vue.herokuapp.com'],
	},
});

socket(io);

/**
 *   @midleware
 */

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
	cors({
		origin: ['http://localhost:8080', 'https://onespace-vue.herokuapp.com'],
		credentials: true,
	})
);
app.use(morgan('common'));
app.use(cookieparser());

const HttpError = require('./utils/errorHelper');
const authRoute = require('./routes/authRoutes');
const postRoute = require('./routes/postRoutes');
const commentRoute = require('./routes/commentRoutes');

const User = require('./models/User');
const Post = require('./models/Post');

mongoose.connect(
	'mongodb+srv://giorgi:giooig_geo@cluster0.jq3s2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	},
	() => console.log('connected to db!')
);

/**
 * @enable cookie store in front end
 * axios.post('url',{},{withCredentials:true}) or
 * axios.defaults.withCredentials=true
 */

app.get('/', (req, res) => {
	res.send('works');
});

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

/**
 * @routes
 */

app.use('/api/user', authRoute);
app.use('/api/post', postRoute);
app.use('/api/comment', commentRoute);

// catch route error
app.use((req, res, next) => {
	return next(new HttpError('Could not find this route'));
});

app.use((error, req, res, next) => {
	console.log(error.message);
	// delete image if we got an error
	// multer adds file property to request object
	if (req.file) {
		fs.unlink(req.file.path, (err) => console.log(err));
	}
	res.statusCode = error.code || 500;
	res.json({
		message: error.message,
		stack: error.stack,
	});
});

const port = process.env.PORT;

server.listen(port || 5000, () => console.log('server up and running'));
