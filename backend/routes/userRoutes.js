import express from 'express'
import { activateEmail, authUser, deleteUser, facebookLogin, forgotPassowrd, getUserInfo, getUsers, registerUser, resetPassowrd, updateUser, updateUserInfo } from '../controllers/userController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

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

//@route - /api/v1/users/google_login
router.route('/google_login')
    .post(facebookLogin)

//@route - /api/v1/users/forgotpassword
router.route('/forgotpassword')
    .post(forgotPassowrd)

//@route - /api/v1/users/resetpassword
router.route('/resetpassword')
    .post(protect, resetPassowrd)

//@route - /api/v1/users/userinfo
router.route('/userinfo')
    .get(protect, getUserInfo)

//@route - /api/v1/users
router.route('/')
    .get(protect, admin, getUsers)

//@route - /api/v1/users/update
router.route('/update')
    .put(protect, updateUserInfo)

//@route - /api/v1/users/:id/update
router.route('/:id/update')
    .put(protect, admin, updateUser)

//@route - /api/v1/users/:id/delete
router.route('/:id/delete')
    .put(protect, admin, deleteUser)



export default router