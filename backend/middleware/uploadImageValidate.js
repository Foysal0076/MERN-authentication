import fs from 'fs'
import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from './asyncHandler.js'

export const uploadImageValidate = asyncHandler(async (req, res, next) => {

    if (!req.files || Object.keys(req.files).length === 0) throw new ErrorResponse('No files choosen', 400)

    const file = req.files.file

    if (file.size > 1024 * 1024) {
        removeTempFile(file.tempFilePath)
        throw new ErrorResponse('Size too large', 400)
    }

    // if (file.mimeType !== 'image/jpeg' && file.mimeType !== 'image/png') {
    //     removeTempFile(file.tempFilePath)
    //     throw new ErrorResponse('File format is invalid', 400)
    // }

    next()
})

const removeTempFile = path => {
    fs.unlink(path, err => {
        if (err) throw err
    })
}