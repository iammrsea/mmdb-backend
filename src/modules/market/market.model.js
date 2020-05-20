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
		images: [{ type: String, required: true }],
		address: {
			type: Schema.Types.ObjectId,
			ref: 'Address',
			required: true,
		},
	},
	{ timestamps: true }
);

userSchema.post('remove', removeAddress);

async function removeAddress(doc) {
	console.log('post middleware ', doc);
	const Address = mongoose.model('Address');
	await Address.remove({ market: doc._id });
}

const Market = mongoose.model('Market', marketSchema);
Market.createIndexes({ name: 'text', foodCategory: 'text' });

module.exports = Market;
