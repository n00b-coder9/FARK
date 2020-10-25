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
const shortenUrl = async ({ longUrl }, request) => {
  // validate longurl
  let userId = request.userId;
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
  // If user is not logged in then assign guest userId
  if (!userId) {
    userId = process.env.GUEST_USER_ID;
  }
  // check if url already exists for the user in the db
  const existingUrl = await Url.findOne({ longUrl, owner: userId });
  // If exists return the same instance
  if (existingUrl !== null) {
    return {
      ...existingUrl, longUrl };
  }

  // if url doesnt exist then create a new short url
  const shortUrl = await urlShortener(longUrl);
  const url = new Url({
    longUrl: longUrl,
    shortUrl: shortUrl,
    owner: userId,
    title: '',
    description: '',
  });
  await url.save();
  return { longUrl, shortUrl: url.shortUrl, title: url.title, description: shortUrl.description };
};

// Resolver to add details of url
const addDetails = async ({ title, description, shortUrl, updatedShortUrl }, request) => {
  /**
   *  Check if title and description both are empty
   * and if the short url requested by the user is same as before
  */
  const urlInstance = await Url.find({ shortUrl });
  // Check if details have been updated or not
  if (urlInstance[0].title === title &&
    urlInstance[0].description === description &&
    shortUrl === updatedShortUrl) {
    const error = new Error('Update failed as values have not changed');
    error.code = 422;
    throw error;
  }
  // Check if the short url is empty
  if (updatedShortUrl.length === 0) {
    const error = new Error('Short url cannot be empty');
    error.code = 422;
    throw error;
  }
  const { userId } = request;

  if (shortUrl !== updatedShortUrl) {
    // Check whether this short url is already assigned
    const urlInstance = await Url.find({ shortUrl: updatedShortUrl });
    if (urlInstance.length > 0) {
      const error = new Error('This Url is already used');
      error.code = 409;
      throw error;
    }
  }
  // If either of the field is non-empty , then update the information
  /**
   * Check if the current user is an owner of this url
   * or he created this url when he was not logged in
   * If yes , then update accordingly
   * Otherwise create a new short url and then add the details
   */

  const isUserAnOwner = urlInstance.find((url) => url.owner.toString() === userId.toString());
  if (isUserAnOwner) {
    /**
     * Current user is an owner of this short url,
     * Update and return success message
     */
    await Url.findOneAndUpdate(
        { shortUrl, owner: userId }, { title, description, shortUrl: updatedShortUrl });
    return { message: 'Details Updated successfully!' };
  } else {
    // Generate a new short url private to current user
    const longUrl = urlInstance[0].longUrl;
    let shortenedUrl;
    if (shortUrl === updatedShortUrl) {
      shortenedUrl = await urlShortener(longUrl);
    } else {
      shortenedUrl = updatedShortUrl;
    }
    // Make a new url object including the details and save it in the db
    const url = new Url({
      shortUrl: shortenedUrl,
      longUrl,
      owner: userId,
      title,
      description,
    });
    await url.save();
    return {
      message: 'Details Updated successfully!',
    };
  }
};
module.exports = {
  signUp, login, shortenUrl, addDetails,
};
