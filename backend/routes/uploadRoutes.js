
import express from 'express'
import { uploadAvatar } from '../controllers/uploadContoller.js'
import { protect } from '../middleware/authMiddleware.js'
import { uploadImageValidate } from '../middleware/uploadImageValidate.js'

const router = express.Router()

router.route('/upload_avatar')
    .post(protect, uploadImageValidate, uploadAvatar)

export default router