const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const urlShortener = require('../utils/urlShortener');
const validator = require('../validator');
const User = require('../models/User');
const Url = require('../models/Url');

// Sign in resolver
const signUp = async ({ UserInput }) => {
  const errors = [];
  // Validate input
  if (!validator.isNameOfUserValid(UserInput.name)) {
    errors.push({ 'key': 'name', 'message': 'Please enter a valid name' });
  }
  if (!validator.isEmailValid(UserInput.email)) {
    errors.push({ 'key': 'email', 'message': 'Please enter a valid email' });
  }
  if (!validator.isPasswordValid(UserInput.password)) {
    errors.push({ 'key': 'password', 'message': 'Please enter a valid password' });
  }
  if (errors.length > 0) {
    const error = new Error('Invalid input');
    error.data = errors;
    error.code = 422;
    throw error;
  }

  // Check if user exists
  const userExists = await User.findOne({ email: UserInput.email }) !== null;
  if (userExists) {
    const error = new Error('User already exists');
    error.code = 409;
    throw error;
  }

  // Create hashed password and save the user
  const salt = parseInt(process.env.SALT, 12);
  const password = await bcrypt.hash(UserInput.password, salt);
  const user = new User({
    email: UserInput.email,
    password,
    name: UserInput.name,
  });
  await user.save();
  return { 'message': 'Signup successful' };
};


// Login resolver
const login = async ({ email, password }) => {
  // Check if user exists
  const user = await User.findOne({ email });
  if (user === null) {
    const error = new Error('User does not exist');
    error.code = 404;
    throw error;
  }

  // Check if correct password is provided
  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (passwordsMatch === false) {
    const error = new Error('Wrong password');
    error.code = 401;
    throw error;
  }

  // Generate and return the token
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
  return { token };
};

// URL shortening resolver
const shortenUrl = async ({ userId, longUrl }) => {
  // validate longurl
  const errors = [];
  if (!validator.isUrlValid(longUrl)) {
    errors.push({ 'key': 'url', 'message': 'Please enter a valid url!' });
  }
  // if url is invalid notify the user with an appropriate message
  if (errors.length > 0) {
    const error = new Error('Invalid Input');
    error.code = 422;
    error.data = errors;
    throw error;
  }

  // check if url already exists for the user in the db
  const existingUrl = await Url.findOne({ longUrl: longUrl });
  if (userId === 'guest') {
    userId = process.env.GUEST_USER_ID;
  }
  if (existingUrl !== null) {
    return {
      longUrl: longUrl,
      shortUrl: existingUrl.shortUrl,
      _id: userId,
    };
  }

  // if url doesnt exist then create a new short url
  const shortUrl = await urlShortener(longUrl);
  const url = new Url({
    longUrl: longUrl,
    shortUrl: shortUrl,
    owner: userId,
  });
  await url.save();
  return { longUrl, shortUrl: url.shortUrl };
};
module.exports = {
  signUp, login, shortenUrl,
};
