/* jshint esversion: 6 */
const mongoose = require('mongoose');

let ItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true
  },
  parentID: {

  },
  name: {
    type: String,
    required: true,
    minlength: 6,
    trim: true
  },
  order: {

  }
});

let Item = mongoose.model('Item', ItemSchema);

module.exports = {Item};
