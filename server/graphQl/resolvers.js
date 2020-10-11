const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('../validator');
const User = require('../models/User');

module.exports = {
  async signUp({ UserInput }) {
    const errors = [];
    if (!validator.isEmailValid(UserInput.email)) {
      errors.push({ message: 'Email is invalid' });
    }
    if (!validator.isPasswordValid(UserInput.password)) {
      errors.push({ message: 'Password too short' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid Input');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const userExists = await User.findOne({ email: UserInput.email }) !== null;
    if (userExists) {
      throw new Error('User already exists!');
    }

    const salt = parseInt(process.env.SALT, 12);
    const password = await bcrypt.hash(UserInput.password, salt);

    const user = new User({
      email: UserInput.email,
      password,
      name: UserInput.name,
    });
    return user.save();
  },
  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (user === null) {
      throw new Error('User does not exist');
    }
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (passwordsMatch === false) {
      throw new Error('Wrong Password');
    }
    const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        process.env.TOKEN_PRIVATE_KEY,
        {
          expiresIn: process.env.TOKEN_EXPIRY_TIME,
        },
    );
    return { token: token.toString(), userId: user.id.toString() };
  },
};
