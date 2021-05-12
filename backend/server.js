import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'

const app = express()
dotenv.config()
app.listen(process.env.PORT, console.log(`App runnin in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold))