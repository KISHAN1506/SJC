const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
  },
  fullName: {
    type: String,
    trim: true,
  },
});

const plugin = typeof passportLocalMongoose === 'function' ? passportLocalMongoose : passportLocalMongoose.default;
userSchema.plugin(plugin);

module.exports = mongoose.model('User', userSchema);
