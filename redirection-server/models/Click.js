const mongoose = require('mongoose');


const Click = new mongoose.Schema({
  location: {
    type: 'Object',
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model('Click', Click);
