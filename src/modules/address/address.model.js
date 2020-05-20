const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema(
	{
		text: {
			type: String,
		},
		geolocation: {
			lat: {
				type: Number,
				required: true,
			},
			long: {
				type: Number,
				required: true,
			},
		},
		market: {
			type: Schema.Types.ObjectId,
			ref: 'Market',
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Address', addressSchema);
