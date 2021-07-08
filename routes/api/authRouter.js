const express = require('express')
const router = express.Router()

const { asyncWrapper } = require('../../src/helpers/apiHelpers')
const { authMiddleware } = require('../../src/middlewares/authMiddleware')
const { shemaAuthValidation } = require('../../src/middlewares/validatorContact')

const {
  registrationController,
  loginController,
  logoutController,
  currentUserController
} = require('../../src/controllers/authController')

router.post('/registration', shemaAuthValidation, asyncWrapper(registrationController))
router.post('/login', shemaAuthValidation, asyncWrapper(loginController))
router.post('/logout', authMiddleware, asyncWrapper(logoutController))
router.get('/current', authMiddleware, asyncWrapper(currentUserController))

module.exports = router
