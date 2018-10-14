/* jshint esversion: 6 */
const mongoose = require('mongoose');

let FolderSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true
  },
  parentID: {},
  name: {
    type: String,
    required: true,
    minlength: 6,
    trim: true
  },
  order: {},
  toggle: {},
  hasChild: {
    type: Boolean
  }
});

let Folder = mongoose.model('Folder', FolderSchema);

module.exports = {Folder};
