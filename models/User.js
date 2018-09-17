const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Schema = mongoose.Schema;

var UserSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  }
});

UserSchema.pre('save', function (next){
  let user = this;
  if (!user.isModified('password')) return next();

  bcrypt.hash(user.passord, saltRounds, function (err, hash) {
    if (err) return (err);
    user.password = hash;
    next();
  })
})

const User = mongoose.model('User', UserSchema);

module.exports = User;