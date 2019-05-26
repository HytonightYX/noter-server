const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
	text: {
		type: String,
		default: ''
	},
	title: {
		type: String,
		required: true
	},
	modified_by_others: {
		type: Boolean,
		default: false
	},
	owner: {
		type: mongoose.SchemaTypes.ObjectId,
		required: true
	},
	cover_url: {
		type: String,
	},
	updated: {
		type: Date,
		default: Date.now
	}
})

module.exports = Note = mongoose.model('notes', NoteSchema)