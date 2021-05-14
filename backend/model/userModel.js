import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/foydb/image/upload/v1620896248/avatar/avatar_keh4zz.png'
    }
}, {
    timestamps: true
})

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         next()
//     }
//     const salt = await bcrypt.genSalt(10)
//     this.password = await bcrypt.hash(this.password, salt)
// })

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User