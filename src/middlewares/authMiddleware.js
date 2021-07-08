const jwt = require('jsonwebtoken')
const { NotAuthorizedError } = require('../helpers/error')

// Создайте мидлвар для проверки токена и добавь его ко всем маршрутам, которые должны быть защищены.

// Мидлвар берет токен из заголовков Authorization, проверяет токен на валидность.
// В случае ошибки вернуть Ошибку Unauthorized.
// Если валидация прошла успешно, получить из токена id пользователя. Найти пользователя в базе данных по этому id.
// Если пользователь существует и токен совпадает с тем, что находится в базе, записать его данные в req.user и вызвать методnext().
// Если пользователя с таким id не существует или токены не совпадают, вернуть Ошибку Unauthorized
// Middleware unauthorized error
// Status: 401 Unauthorized
// Content-Type: application/json
// ResponseBody: {
//   "message": "Not authorized"

const authMiddleware = (req, res, next) => {
  const [, token] = req.header.authorization.split(' ')
  if (!token) {
    next(new NotAuthorizedError('Not authorized'))
  }
  try {
    const user = jwt.decode(token, process.env.JWT_SECRET)
    if (!user) {
      return next(new NotAuthorizedError('Invalid token'))
    }
    req.token = token
    req.user = user
    next()
  } catch (error) {
    next(new NotAuthorizedError('Invalid token'))
  }
}

module.exports = {
  authMiddleware
}
