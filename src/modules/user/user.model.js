const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		validate: {
			validator(email) {
				return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
			},
			message(props) {
				return `${props.value} is not a valid email address`;
			},
		},
	},
	password: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('user', userSchema);
