import express from 'express'
import { activateEmail, authUser, forgotPassowrd, registerUser, resetPassowrd } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

//@route - /api/v1/users/register
router.route('/register')
    .post(registerUser)

//@route - /api/v1/users/activate
router.route('/activate')
    .post(activateEmail)

//@route - /api/v1/users/login
router.route('/login')
    .post(authUser)

//@route - /api/v1/users/forgotpassword
router.route('/forgotpassword')
    .post(forgotPassowrd)

//@route - /api/v1/users/resetpassword
router.route('/resetpassword')
    .post(protect, resetPassowrd)

export default router