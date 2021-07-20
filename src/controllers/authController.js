const {
  registration,
  login,
  logout,
  current,
  verifyEmail,
  repeatEmailVerify
} = require('../../services/authService')

const registrationController = async (req, res, next) => {
  const { email, password } = req.body
  await registration(email, password)
  res.status(201).json({ status: 'success' })
}

const loginController = async (req, res) => {
  const { email, password } = req.body
  const token = await login(email, password)
  res.status(201).json({ status: 'success', token })
}

const logoutController = async (req, res) => {
  const token = req.token
  const userId = req.user._id
  await logout({ userId, token })
  res.status(204).json({ status: 'No Content' })
}

const currentUserController = async (req, res) => {
  const user = await current(req.user._id)
  res.status(200).json(user)
}

const verifyEmailController = async (req, res) => {
  await verifyEmail(req.params.verificationToken)
  res.status(200).json({ message: 'Verification successful' })
}

const repeatEmailVerifyController = async (req, res) => {
  const { email } = req.body
  await repeatEmailVerify(email)
  res.status(200).json({ message: 'Verification email sent' })
}

module.exports = {
  registrationController,
  loginController,
  logoutController,
  currentUserController,
  verifyEmailController,
  repeatEmailVerifyController
}
