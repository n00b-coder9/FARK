const mongoose = require('mongoose');

const { Schema } = mongoose;

const urlSchema = new Schema(
    {
      longUrl: {
        type: String,
        required: true,
      },
      shortUrl: {
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
      title: {
        type: String,
      },
      description: {
        type: String,
      },
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
