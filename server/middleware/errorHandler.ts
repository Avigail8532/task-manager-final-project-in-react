import { ErrorRequestHandler } from 'express'
import { AppError } from '../utils/AppError'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err)

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    })
    return
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: err.message,
    })
    return
  }

  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: 'Invalid request data.',
    })
    return
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  })
}
