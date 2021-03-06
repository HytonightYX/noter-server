const Router = require('koa-router')
const router = new Router()
const bcrypt = require('bcryptjs')

// 引入User
const User = require('../../models/User')

/**
 * @route GET api/users/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.get('/test', async ctx => {
	ctx.status = 200
	ctx.body ={msg: "users works"}
})

/**
 * @route GET api/users/:id
 * @desc 根据id获取用户详情
 */
router.get('/:id', async ctx => {
	await User.findById(ctx.params.id)
		.then((user) => {
			ctx.body = user
		})
})

/**
 * @route PATCH api/users/:id
 * @desc 根据传入新user修改用户信息
 */
router.patch('/:id', async ctx => {
	await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, {new: true})
		.then((user) => {
			ctx.body = user
		})
})

/**
 * @route POST api/users/register
 * @desc 新用户注册
 * @access 接口是公开的
 */
router.post('/register', async ctx => {
	// console.log(ctx.request.body)

	const findRet = await User.find({email: ctx.request.body.email})
	if (findRet.length > 0) {
		ctx.status = 500
		ctx.body = {'email': '邮箱已被占用'}
	} else {
		// 实例化一个新的user
		const newUser = new User({
			username: ctx.request.body.username,
			email: ctx.request.body.email,
			password: ctx.request.body.password
		})

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if (err) throw err
				newUser.password = hash
			});
		});

		// console.log(newUser)
		// 存储到数据库
		newUser.save()
			.then((user) => {
				console.log(newUser)
				// 成功后返回JSON数据
				ctx.body = user
			})
			.catch((err) => {
				console.log(err)
			})
		ctx.body = newUser
	}
})

module.exports = router.routes()
