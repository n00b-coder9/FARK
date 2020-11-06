const mongoose = require('mongoose');
const { Schema } = mongoose;

const Click = new Schema({
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
});
module.exports = mongoose.model('Click', Click);
