/* jshint esversion: 6 */
const mongoose = require('mongoose');

let ItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true
  },
  name: {
    type: String,
    required: true,
    minlength: 6,
    trim: true
  },
  parentID: {}
});

let Item = mongoose.model('Item', ItemSchema);

module.exports = {Item};
