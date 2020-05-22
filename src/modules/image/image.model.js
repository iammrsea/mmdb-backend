const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
	fileId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: false,
	},
	url: {
		type: String,
		required: true,
	},
	thumbnailUrl: {
		type: String,
		required: false,
	},
	market: {
		type: Schema.Types.ObjectId,
		ref: 'Market',
	},
});

module.exports = mongoose.model('Image', imageSchema);
