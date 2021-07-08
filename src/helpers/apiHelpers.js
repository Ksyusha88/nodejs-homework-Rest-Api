const {
  NodeError,
} = require('./error')

const asyncWrapper = (controller) => {
  return (req, res, next) => {
    controller(req, res).catch(next)
  }
}

const errorHandler = (error, req, res, next) => {
  if (error instanceof NodeError) {
    return res.status(error.status).json({ message: error.message })
  }
  res.status(404).json({ message: error.message })
}

module.exports = {
  asyncWrapper,
  errorHandler
}
