import cloudinary from 'cloudinary'
import fs from 'fs'
import asyncHandler from '../middleware/asyncHandler.js'
import ErrorResponse from '../utils/errorResponse.js'


export const uploadAvatar = asyncHandler(async (req, res) => {

    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET,
    })

    const file = req.files.file

    cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: 'avatar', width: 150, height: 150, crop: 'fill'
    }, function (err, result) {
        if (err) throw err
        removeTempFile(file.tempFilePath)
        res.json({ url: result.secure_url })

    })

    const removeTempFile = path => {
        fs.unlink(path, err => {
            if (err) throw err
        })
    }
})