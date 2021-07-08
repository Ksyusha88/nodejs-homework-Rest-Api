const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User } = require('../db/userModal')
const { NotAuthorizedError, RegistrationConflictError } = require('../src/helpers/error')

const registration = async (email, password) => {
  const registEmail = await User.findOne({ email })
  if (registEmail) {
    throw new RegistrationConflictError('Email in use')
  }
  const newUser = new User({
    email, password
  })
  await newUser.save()
  return {
    user: {
      email: newUser.email,
      subscription: newUser.subscription
    },
  }
}

const login = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new NotAuthorizedError('Email or password is wrong')
  }

  if (!await bcrypt.compare(password, user.password)) {
    throw new NotAuthorizedError('Email or password is wrong')
  }

  const token = jwt.sign({
    _id: user._id,
    email: user.email
  }, process.env.JWT_SECRET)

  await User.findOneAndUpdate({ email }, { $set: { token } })
  return {
    token,
    user: { email: user.email, subscription: user.subscription }
  }
}

const logout = async ({ userId, token }) => {
  await User.findByIdAndUpdate(
    { _id: userId, token },
    { $set: { token: null } },
  )
}

const current = async ({ userId, token }) => {
  const currentUser = await User.findOne({
    _id: userId,
    token
  })
  if (!currentUser) {
    throw new NotAuthorizedError('Not authorized')
  }
  return currentUser
}

module.exports = {
  registration,
  login,
  logout,
  current
}
