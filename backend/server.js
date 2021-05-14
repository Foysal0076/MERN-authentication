import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import connectDB from './config/db.js'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import cookieParser from 'cookie-parser'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import userRoutes from './routes/userRoutes.js'

const app = express()
dotenv.config()
connectDB()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())
// app.use(cookieParser) //creating problem with normal request
app.use(fileUpload({
    useTempFiles: true
}))

//routes
app.use('/api/v1/users', userRoutes)



//Error middleware
app.use(notFound)
app.use(errorHandler)

app.listen(process.env.PORT, console.log(`App running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold))