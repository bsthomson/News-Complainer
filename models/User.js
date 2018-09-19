const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

const Schema = mongoose.Schema

var UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    index: { unique: true }
  },
  password: {
    type: String,
    required: true
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }
})

UserSchema.pre('save', function (next) {
  let user = this
  if (!user.isModified('password')) return next()

  bcrypt.hash(user.passord, saltRounds, function (err, hash) {
    if (err) return (err)
    user.password = hash
    next()
  })
})

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

const User = mongoose.model('User', UserSchema)

module.exports = User
