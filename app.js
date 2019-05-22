const Koa = require('koa')
const Router = require('koa-router')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser');
const mongoURI = require('./config/keys').mongoURI

const port = process.env.PORT || 3030
const app = new Koa()
const router = new Router()

// middleware
app.use(bodyParser())

// 引入users.js
const users = require('./routes/api/users')

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

// 配置路由地址 /api/users
router.use('/api/users', users)

// 配置路由
app.use(router.routes())
	.use(router.allowedMethods())

app.listen(port, () => {
	console.log('Noter server has started on ' + port)
})