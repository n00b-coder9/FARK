const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  // eslint-disable-next-line no-unused-vars
  async signUp({ UserInput }, req) {
    const errors = [];
    if (!validator.isEmail(UserInput.email)) {
      errors.push({ message: ' Email is invalid' });
    }
    if (
      validator.isEmpty(UserInput.password)
      || !validator.isLength(UserInput.password, { min: 5 })
    ) {
      errors.push({ message: 'Password too short' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid Input');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existinguser = await User.findOne({ email: UserInput.email });
    if (existinguser) {
      const error = new Error('User already exists!');
      throw error;
    }
    const password = await bcrypt.hash(UserInput.password, 12);
    const user = new User({
      email: UserInput.email,
      password,
      name: UserInput.name,
    });
    const createdUser = await user.save();
    return createdUser;
  },
  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('User does not exist');
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong Password');
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      'somesecretsecrettoken',
      {
        expiresIn: '30 days',
      },
    );
    return { token: token.toString(), userId: user.id.toString() };
  },
};
