const Router = require('koa-router')
const router = new Router()

const Note = require('../../models/Note')
const User = require('../../models/User')

/**
 * 测试接口
 */
router.get('/test', async ctx => {
	ctx.status = 200
	ctx.body ={msg: "notes works"}
})

/**
 * @route POST api/notes/add
 * @desc 添加笔记
 * @access 接口是公开的
 */
router.post('/add', async ctx => {
	const user = await User.findById(ctx.request.body.owner)
	const newNote = new Note({
		text: ctx.request.body.text,
		owner: user,
	})

	newNote.save()
		.then((note) => {
			console.log(note)
			// 成功后返回JSON数据
			ctx.body = note
		})
		.catch((err) => {
			console.log(err)
		})
})

/**
 * @route GET api/notes
 * @desc 获取所有笔记
 * @access 接口是公开的
 */
router.get('/', async ctx => {
	await Note
		.find({})
		.then((list) => {
			ctx.body = list
		})
		.catch((err) => {
			console.log(err)
		})
})

/**
 * @route GET api/notes/id
 * @desc 根据id获取笔记详情
 * @access 接口是公开的
 */
router.get('/:id', async ctx => {
	await Note
		.findById(ctx.params.id)
		.then((note) => {
			ctx.body = note
		})
		.catch((err) => {
			console.log(err)
		})
})

/**
 * @route PATCH api/notes
 * @desc 根据id获取笔记详情
 * @param {id, text}
 * @access 接口是公开的
 */
router.patch('/', async ctx => {
	console.log(ctx.request.body.text)
	await Note.updateOne(
		{_id: ctx.request.body.id}, {text: ctx.request.body.text, updated: new Date()}, {multi: false},
		)
		.then((res) => {
			console.log(res)
			ctx.status = 200
			ctx.body = res
		})
		.catch((err) => {
			console.log(err)
			})
})

module.exports = router.routes()