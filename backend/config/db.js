import mongoose from 'mongoose'
import colors from 'colors'
const connectDB = async () => {
    try {
        const dbConnection = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        console.log(`MongoDB Connected: ${dbConnection.connection.host}`.cyan)
    } catch (error) {
        console.log(`Error: ${error.message}`.inverse.underline.bold)
        process.exit(1)
    }
}

export default connectDB