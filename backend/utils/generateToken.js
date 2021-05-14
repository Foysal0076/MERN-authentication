import jwt from 'jsonwebtoken'

const generateActivationToken = (user) => {
    return jwt.sign({ user }, process.env.JWT_ACTIVATION_SECRET, {
        expiresIn: '1d'
    })
}

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '1d'
    })
}

const generateRefreshToken = (user) => {
    return jwt.sign({ user }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '1d'
    })
}

export { generateActivationToken, generateAccessToken, generateRefreshToken }