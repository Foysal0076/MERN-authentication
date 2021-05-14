import asyncHandler from "./asyncHandler.js"
import jwt from 'jsonwebtoken'
import User from "../model/userModel.js"
import ErrorResponse from "../utils/errorResponse.js"

const protect = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

            req.user = await User.findById(decoded.id).select('-password')

            next()

        } catch (error) {
            console.log(error)
            throw new ErrorResponse('Not Authorized', 401)
        }
    }
    if (!token) {
        throw new ErrorResponse('Not Authorized', 401)
    }
})

const admin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next()
    } else {
        throw new ErrorResponse('Not Authorized as Admin', 403)
    }
})

export { protect, admin }