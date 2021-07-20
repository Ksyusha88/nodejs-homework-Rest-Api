const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const gravatar = require('gravatar')

const userScheme = new mongoose.Schema({
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter'
  },
  token: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: function() {
      return gravatar.url(this.email, { protocol: 'http', s: '100' }, true)
    },
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
})

userScheme.pre('save', async function() {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 10)
  };
})

const User = mongoose.model('User', userScheme)

module.exports = {
  User
}
