const mongoose = require('mongoose');

const { Schema } = mongoose;

const urlSchema = new Schema(
  {
    longurl: {
      type: String,
      required: true,
    },
    shorturl: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    readaccess: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
    writeaccess: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('Url', urlSchema);
