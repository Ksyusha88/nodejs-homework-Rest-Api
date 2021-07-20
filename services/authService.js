const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const sgMail = require('@sendgrid/mail')
require('dotenv').config()

const { User } = require('../db/userModal')
const { NotAuthorizedError, RegistrationConflictError, NotFindUser, WrongParametersError } = require('../src/helpers/error')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const registration = async (email, password) => {
  const registEmail = await User.findOne({ email })
  if (registEmail) {
    throw new RegistrationConflictError('Email in use')
  }
  const newUser = new User({
    email, password, verifyToken: uuidv4(),
  })
  await newUser.save()

  const msg = {
    to: email,
    from: 'ksyusha.gorelova@gmail.com',
    subject: 'Thank you for registration!',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  await sgMail.send(msg)

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
const verifyEmail = async verificationToken => {
  if (!(await User.findOne({ verifyToken: verificationToken }))) {
    throw new NotFindUser('User not found')
  }
  await User.findOneAndUpdate(
    {
      verifyToken: verificationToken,
      verify: false,
    },
    {
      $set: {
        verify: true,
        verifyToken: null,
      },
    },
  )
}

const repeatEmailVerify = async email => {
  if (await User.findOne({ email, verify: true })) {
    throw new WrongParametersError('Verification has already been passed')
  }
  const user = await User.findOne({ email, verify: false })
  const msg = {
    to: user.email,
    from: 'ksyusha.gorelova@gmail.com',
    subject: 'Thank you for registration!',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>'
  }

  await sgMail.send(msg)
}
module.exports = {
  registration,
  login,
  logout,
  current,
  verifyEmail,
  repeatEmailVerify
}
