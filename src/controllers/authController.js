const {
  registration,
  login,
  logout,
  current
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

module.exports = {
  registrationController,
  loginController,
  logoutController,
  currentUserController
}
