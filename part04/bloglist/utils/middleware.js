const User = require('../models/user')
const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
    let authorization = request.get('authorization', null)
    if (authorization && authorization.startsWith('Bearer ')) {
       authorization = authorization.replace('Bearer ', '')
    }
    request.token = authorization
    next()
}

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return next()
  }
  const decodedToken = jwt.verify(request?.token, process.env.SECRET)
  if (!decodedToken.id) {
      return response.status(401).json({error: 'token invalid'})
  }
  request.user = decodedToken
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: 'validation error' })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}