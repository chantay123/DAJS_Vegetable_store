const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, },
  URL: { type: String, default: '', },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'menu', default: null },
  isDeleted: { type: Boolean, default: false, },
},{   
  timestamps: true,
});

module.exports = mongoose.model('menu', menuSchema);