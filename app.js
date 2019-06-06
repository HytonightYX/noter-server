// const auth = require('auth')
const Koa = require('koa')
const Router = require('koa-router')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser');
const mongoURI = require('./config/keys').mongoURI
const cors = require('koa2-cors');
const axios = require('axios')
const port = process.env.PORT || 3030
const app = new Koa()
const router = new Router()


// middleware
app.use(bodyParser())
app.use(cors())
// 引入users.js
const users = require('./routes/api/users')
const notes = require('./routes/api/notes')
const auth = require('./routes/api/auth')

// 路由
router.get('/', async ctx => {
	ctx.body = {msg: 'hello koa!'}
})

// 连接数据库
mongoose.connect(mongoURI, { useNewUrlParser: true })
	.then(() => {
		console.log('MongoDB connected!')
	})
	.catch((err) => {
		console.log(err)
	})

const oauth = async ctx => {
	const requestToken = ctx.request.query.code;
	console.log(requestToken)
	console.log(ctx.request)
	console.log('authorization code:', requestToken);
	let ok = 0

	const tokenResponse = await axios({
		method: 'post',
		url: 'https://github.com/login/oauth/access_token?' +
			`client_id=${clientID}&` +
			`client_secret=${clientSecret}&` +
			`code=${requestToken}`,
		headers: {
			accept: 'application/json'
		}
	}).catch((err) => {
		console.log(err)
		ok = 0
		ctx.response.redirect(`/loginResult?ok=${ok}`);
	});

	console.log(tokenResponse.data)

	const accessToken = tokenResponse.data.access_token;
	console.log(`access token: ${accessToken}`);

	const result = await axios({
		method: 'get',
		url: `https://api.github.com/user`,
		headers: {
			accept: 'application/json',
			Authorization: `token ${accessToken}`
		}
	}).catch((err) => {
		console.log(err)
		ok = 0
		ctx.response.redirect(`/loginResult?ok=${ok}`);
	});
	console.log(result.data);

	ctx.body = {
		ok: 1
	}
	// ctx.response.redirect(`/welcome.html?username=${username}`);
};


// 配置路由地址 /api/users
router.use('/api/users', users)
router.use('/api/notes', notes)
router.use('/api/auth', auth)


// 配置路由
app.use(router.routes())
	.use(router.allowedMethods())

app.listen(port, () => {
	console.log('Noter server has started on ' + port)
})