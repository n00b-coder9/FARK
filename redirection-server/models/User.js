const mongoose = require('mongoose');
const { isEmailValid, isNameOfUserValid } = require('../validator');

const { Schema } = mongoose;
const userSchema = new Schema(
    {
      email: {
        type: String,
        required: true,
        validate: isEmailValid,
      },
      name: {
        type: String,
        required: true,
        validate: isNameOfUserValid,
      },
      password: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    },
);
module.exports = mongoose.model('User', userSchema);
