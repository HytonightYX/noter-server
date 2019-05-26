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

router.get('/:id')

module.exports = router.routes()