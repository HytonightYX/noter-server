const Router = require('koa-router')
const router = new Router()
const User = require('../../models/User')
const axios = require('axios')
const Auth_github = require('../../config/keys').Auth_github

/**
 * 测试接口
 */
router.get('/test', async ctx => {
	ctx.status = 200
	ctx.body = {msg: 'auth works'}
})

/**
 * 使用 OAuth2.0 时的登录接口
 */
router.get('/callback', async (ctx, next) => {//这是一个授权回调，用于获取授权码 code
	let code = ctx.request.query.code // GitHub 回调传回 code 授权码

	// 带着 授权码code、client_id、client_secret 向 GitHub 认证服务器请求 token
	let res_token = await axios.post('https://github.com/login/oauth/access_token',
	{
		client_id: Auth_github.client_id,
		client_secret: Auth_github.client_secret,
		code: code
	})

	const token = res_token.data.split('=')[1].replace('&scope', '')

	// 带着 token 从 GitHub 获取用户信息
	const github_API_userInfo = await axios.get(`https://api.github.com/user?access_token=${token}`)
		// console.log('github 用户 API：', github_API_userInfo.data)
	const userInfo = github_API_userInfo.data
	console.log('token' + token)

	console.log('拿到的数据', userInfo.id)

	const oldUser = await User.findOne({github_id: userInfo.id})

	if (oldUser) {
		console.log('存在该用户' + oldUser)
		ctx.cookies.set('userid', oldUser._id, {httpOnly: false})
		ctx.cookies.set('auth_token', res_token.data)
		ctx.response.redirect('http://47.99.215.152:3000/noter/')
	} else {
		const newUser = new User({
			username: userInfo.login,
			email: userInfo.email ? userInfo.email : '',
			password: '123456a',
			avatar_url: userInfo.avatar_url,
			github_id: userInfo.id
		})
		await newUser.save()
			.then(async (savedUser) => {
				if(savedUser){
					const newId = savedUser._id
					console.log('创建新用户成功' + newId)
					console.log(savedUser)
					ctx.cookies.set('userid', newId, {httpOnly: false})
					ctx.cookies.set('auth_token', res_token.data)
				}
			}).then(() => {
				ctx.response.redirect('http://47.99.215.152:3000/noter/')
			})
			.catch(
				err => {
					console.log(err)
				}
			)
	}
})

module.exports = router.routes()
