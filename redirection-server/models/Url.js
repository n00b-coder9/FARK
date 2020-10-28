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
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      clicks: [{
        location: {
          type: 'Object',
          required: true,
        },
        time: {
          type: String,
          required: true,
        },
        ip: {
          type: String,
          required: true,
        },
      }],
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
