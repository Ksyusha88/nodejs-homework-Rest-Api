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

const { avatarsController } = require('../../src/controllers/avatarsController')
const upload = require('../../src/helpers/upload')

router.post('/registration', shemaAuthValidation, asyncWrapper(registrationController))
router.post('/login', shemaAuthValidation, asyncWrapper(loginController))
router.post('/logout', authMiddleware, asyncWrapper(logoutController))
router.get('/current', authMiddleware, asyncWrapper(currentUserController))
router.patch('/avatars', upload.single('avatar'), asyncWrapper(avatarsController))
module.exports = router
