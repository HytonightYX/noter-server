const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const AuthSchema = new Schema({
	password: {
		type: String,
		require: true,
		default: ''
	},
	salt: {
		type: String,
		require: true,
		default: ''
	},
	updated: {
		type: Date,
		default: Date.now
	}
})

module.exports = Note = mongoose.model('auth', AuthSchema)
