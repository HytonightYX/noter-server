const Koa = require('koa')
const Router = require('koa-router')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser');
const mongoURI = require('./config/keys').mongoURI
const cors = require('koa2-cors');
const port = process.env.PORT || 3035
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
