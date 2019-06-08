const mongoose = require('mongoose')

const Schema = mongoose.Schema;

// 实例化数据模型
const UserSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
	},
	password: {
		type: String,
		required: true
	},
	avatar_url: {
		type: String,
	},
	date: {
		type: Date,
		default: Date.now
	},
	github_id: {
		type: String,
		required: true
	}
})

module.exports = User = mongoose.model('users', UserSchema)
