//imports dependencies
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('./user.model');
const { throwError } = require('../../utils');

class UserService {
	async signUp({ email, password }) {
		try {
			const emailAlreadExists = await UserModel.findOne({ email });
			if (emailAlreadExists) {
				return throwError('User already exists');
			}
			const hashedPassword = await bcrypt.hash(password, 13);
			const newUser = new UserModel({
				email: email,
				password: hashedPassword,
			});
			const savedUser = await newUser.save();

			return { _id: savedUser._id, email: savedUser.email };
		} catch (error) {
			return throwError(error);
		}
	}
	async users() {
		return await UserModel.find({});
	}
	deleteUsers() {
		return UserModel.deleteMany({});
	}
	async signIn({ email, password }) {
		try {
			let userExists = await UserModel.findOne({ email });
			if (!userExists) {
				return throwError('Invalid Login credentials');
			}
			let match = await bcrypt.compare(password, userExists.password);
			if (!match) {
				return throwError('Invalid Login credentials');
			}
			const token = await this._signToken(userExists._id, userExists.email);
			return {
				userId: userExists._id.toString(),
				token: token,
				// tokenExpiration: 2,
			};
		} catch (error) {
			return throwError(error);
		}
	}

	_signToken(userId, email) {
		return jwt.sign(
			{
				userId,
				email,
			},
			process.env.JWT_SECRET,
			{ expiresIn: '72h' }
		);
	}
}

module.exports = new UserService();
