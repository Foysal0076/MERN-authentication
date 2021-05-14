import validator from "validator"
import asyncHandler from "../middleware/asyncHandler.js"
import User from "../model/userModel.js"
import ErrorResponse from "../utils/errorResponse.js"
import { generateAccessToken, generateActivationToken, } from '../utils/generateToken.js'
import sendEmail from "./sendMail.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

//@ route POST /api/v1/users
//@desc Register new user
//@access Public
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        throw new ErrorResponse('Please fill in all fields', 400)
    }
    if (!validator.isEmail(email)) {
        throw new ErrorResponse('Email is invalid', 400)
    }

    if (!validator.isLength(password, 6, 20)) {
        throw new ErrorResponse('Pasword must be between 6 to 20 characters', 400)
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
        throw new ErrorResponse('User already exists', 400)
    }

    const passwordHash = bcrypt.hashSync(password, 10)
    const user = {
        name,
        email,
        password: passwordHash
    }
    const ativationToken = generateActivationToken(user)
    const url = `${process.env.CLIENT_URL}/user/activate/${ativationToken}`

    sendEmail(email, url)

    return res.json({ msg: "Register Success! Please activate your email to start." })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.iAdmin,
        })
    } else {
        throw new ErrorResponse('Server Error', 500)
    }
})

export const activateEmail = asyncHandler(async (req, res) => {
    const { activation_token } = req.body
    const { user } = jwt.verify(activation_token, process.env.JWT_ACTIVATION_SECRET)

    const { name, email, password } = user

    const userExists = await User.findOne({ email })
    if (userExists) throw new ErrorResponse('User already exists', 400)

    const newUser = new User({
        name,
        email,
        password
    })
    await newUser.save()

    res.json({ success: true, message: 'Account has been activated', data: newUser })

})

export const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new ErrorResponse('Please fill in all fields', 400)
    }
    if (!validator.isEmail(email)) {
        throw new ErrorResponse('Email is invalid', 400)
    }

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: (await user)._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateAccessToken(user._id)
        })
    } else {
        throw new ErrorResponse('Invalid email or password', 400)
    }
})

export const forgotPassowrd = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) {
        throw new ErrorResponse('Please fill in all fields', 400)
    }
    if (!validator.isEmail(email)) {
        throw new ErrorResponse('Email is invalid', 400)
    }

    const user = await User.findOne({ email })
    if (!user) throw new ErrorResponse('User does not exist', 400)

    const access_token = generateAccessToken(user._id)
    const url = `${process.env.CLIENT_URL}/user/reset/${access_token}`

    sendEmail(email, url, 'Reset Your password')
    res.status({ success: true, message: 'Re-send password, Please check your email inbox' })

})

export const resetPassowrd = asyncHandler(async (req, res) => {
    const { password } = req.body
    if (!password) {
        throw new ErrorResponse('Please Enter a new password', 400)
    }

    if (!validator.isLength(password, 6, 20)) {
        throw new ErrorResponse('Pasword must be between 6 to 20 characters', 400)
    }

    const passwordHash = await bcrypt.hash(password, 10)

    console.log(req.user)

    await User.findOneAndUpdate({ _id: req.user.id }, {
        password: passwordHash
    })

    res.json({ success: true, message: 'Password has been changed successfully' })
})