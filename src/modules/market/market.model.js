const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marketSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		foodCategory: {
			type: String,
			required: true,
		},
		images: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Image',
				required: true,
			},
		],
		address: {
			type: String,
			required: true,
		},
		location: {
			type: {
				type: String,
				default: 'Point',
			},
			coordinates: [{ type: Number, required: true }],
		},
	},
	{ timestamps: true }
);

marketSchema.post('remove', removeLinkedDocuments);

async function removeLinkedDocuments(doc) {
	// console.log('post middleware ', doc);
	const Image = mongoose.model('Image');
	await Image.remove({ _id: { $in: doc.images } });
}

const Market = mongoose.model('Market', marketSchema);
// // marketSchema.indexes({ name: 'text', foodCategory: 'text', location: '2dsphere' });
// Market.createIndexes({ name: 'text', foodCategory: 'text', location: '2dsphere' });
// Market.on('index', (error, data) => {
// 	console.log('index event called', error, data);
// });

module.exports = Market;
