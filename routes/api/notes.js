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
router.post('/', async ctx => {
	const newNote = new Note({
		title: ctx.request.body.title,
		text: ctx.request.body.text,
		description: ctx.request.body.description,
		owner: ctx.request.body.owner,
	})

	await newNote.save()
		.then((note) => {
			console.log(note)
			// 成功后返回JSON数据
			ctx.body = {ok: 1}
			ctx.status = 200
		})
		.catch((err) => {
			console.log(err)
			ctx.body = {ok: 0}
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
	await Note.updateOne(
		{_id: ctx.request.body.id}, {text: ctx.request.body.text,title: ctx.request.body.title ,updated: new Date()}, {multi: false},
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

/**
 * 根据所有者id获取他的所有笔记
 */
router.get('/owner/:ownerId', async ctx => {
	console.log(ctx.params.ownerId);
	await Note.find({owner: ctx.params.ownerId}).then((users) => {
		ctx.body = users
	})
})

module.exports = router.routes()
