import validator from "validator"
import asyncHandler from "../middleware/asyncHandler.js"
import User from "../model/userModel.js"
import ErrorResponse from "../utils/errorResponse.js"
import { generateAccessToken, generateActivationToken, } from '../utils/generateToken.js'
import sendEmail from "./sendMail.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { google } from 'googleapis'
import axios from 'axios'

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

    sendEmail(email, url, 'Verify account')

    return res.json({ message: "Register Success! Please activate your email to start." })

})

//@ route POST /api/v1/users/activate
//@desc Activate email
//@access Public
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

//@ route POST /api/v1/users/login
//@desc Rturn access token
//@access Public
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

//@ route POST /api/v1/users/forgotpassword
//@desc Reset password request
//@access Public
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
    res.status(200).json({ success: true, message: 'Please check your email inbox, Re-send password?' })

})

//@ route POST /api/v1/users/resetpassword
//@desc Reset password
//@access Private
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

//@ route GET /api/v1/users/userinfo
//@desc Get user information
//@access Private
export const getUserInfo = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id).select('-password')
    res.status(200).json({ success: true, data: user })

})


//@ route GET /api/v1/users
//@desc Get all users
//@access Admin
export const getUsers = asyncHandler(async (req, res) => {

    const pageSize = Number(req.query.per_page) || 5
    const page = Number(req.query.page) || 1

    const count = await User.countDocuments()

    const users = await User.find({})
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .select('-password')
    res.status(200).json({
        success: true,
        count,
        pages: Math.ceil(count / pageSize),
        page: page,
        data: users
    })

})

//@ route PUT /api/v1/users/update
//@desc Update user Information
//@access protect
export const updateUserInfo = asyncHandler(async (req, res) => {

    const { name, avatar } = req.body

    const user = await User.findById(req.user.id)

    if (user) {
        user.name = name || user.name
        user.avatar = avatar || user.avatar
    }

    const updatedUser = await user.save()

    res.status(200).json({ success: true, message: 'Update successful', data: updatedUser })

})

//@ route PUT /api/v1/users
//@desc Update user Information
//@access Admin
export const updateUser = asyncHandler(async (req, res) => {

    const { isAdmin } = req.body
    await User.findByIdAndUpdate(req.params.id, {
        isAdmin
    })
    res.status(204).json({ success: true, message: 'Update successful' })

})

//@ route PUT /api/v1/users/:id/delete
//@desc Delete User
//@access Admin
export const deleteUser = asyncHandler(async (req, res) => {

    await User.findByIdAndDelete(req.params.id)
    res.status(204).json({ success: true, message: 'Delete successful' })

})

//@ route PUT /api/v1/users/google_login
//@desc Login using google credential
//@access Public
const { OAuth2 } = google.auth
const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)

export const googleLogin = asyncHandler(async (req, res) => {
    const { tokenId } = req.body

    const verify = await client.verifyIdToken({ idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID })

    const { email_verified, email, name, picture } = verify.payload

    const password = email + process.env.GOOGLE_SECRET

    const passwordHash = await bcrypt.hash(password, 10)

    if (!email_verified) throw new ErrorResponse('Email verification fail', 400)

    const user = await User.findOne({ email })

    if (user) {
        const isMatch = await user.matchPassword(password)
        if (!isMatch) throw new ErrorResponse('Password is incorrect', 400)

        res.status(200).json({
            _id: user._id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            isAdmin: user.isAdmin,
            token: generateAccessToken(user._id)
        })
    } else {

        const newUser = new User({
            name, email, password: passwordHash, avatar: picture
        })

        await newUser.save()

        res.status(200).json({
            _id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            avatar: newUser.avatar,
            isAdmin: newUser.isAdmin,
            token: generateAccessToken(newUser._id)
        })
    }
})

//@ route PUT /api/v1/users/facebook_login
//@desc Login using facebook credential
//@access Public

export const facebookLogin = asyncHandler(async (req, res) => {
    const { accessToken, userID } = req.body

    const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture.height(150)&access_token=${accessToken}`

    const { data } = await axios.get(URL)

    const { name, email, picture: { data: { url } } } = data

    const password = email + process.env.GOOGLE_SECRET

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await User.findOne({ email })

    if (user) {
        const isMatch = await user.matchPassword(password)
        if (!isMatch) throw new ErrorResponse('Password is incorrect', 400)

        res.status(200).json({
            _id: user._id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            isAdmin: user.isAdmin,
            token: generateAccessToken(user._id)
        })
    } else {

        const newUser = new User({
            name, email, password: passwordHash, avatar: url
        })

        await newUser.save()

        res.status(200).json({
            _id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            avatar: newUser.avatar,
            isAdmin: newUser.isAdmin,
            token: generateAccessToken(newUser._id)
        })
    }
})