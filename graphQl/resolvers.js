/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
const bcrypt = require('bcrypt');
const validator = require('validator');
//const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
	createUser: async function ({ UserInput }, req) {
		const errors = [];
		if (!validator.isEmail(UserInput.email)) {
			errors.push({ message: ' Email is invalid' });
		}
		if (
			validator.isEmpty(UserInput.password) ||
			!validator.isLength(UserInput.password, { min: 5 })
		) {
			errors.push({ message: 'Password too short' });
		}
		if (errors.length > 0) {
			const error = new Error('Invalid Input');
			error.data = errors;
			error.code = 422;
			throw error;
		}
		const password = await bcrypt.hash(UserInput.password, 12);
		const user = new User({
			email: UserInput.email,
			password: password,
			name: UserInput.name,
		});
		console.log(user);
		return user;
	},
};
