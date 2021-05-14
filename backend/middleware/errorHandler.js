import ErrorResponse from "../utils/errorResponse.js"

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

const errorHandler = (err, req, res, next) => {
    console.log(err)

    let error = { ...err }

    error.message = err.message

    if (err.name === 'CastError') {
        const message = 'Resource not found'
        error = new ErrorResponse(message, 400)
    }

    if (err.code === 11000) {
        const message = 'Duplicate field value entered'
        error = new ErrorResponse(message, 400)
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(error => error.message).join(', ')
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    })

}

export { errorHandler, notFound }