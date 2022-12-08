
const jwt = require('jsonwebtoken')
const CustomAPIError = require('../errors/custom-error')

const login = async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        throw new CustomAPIError('Please provide email and password', 400)
    }
    
    //just for demonstration purposes, normally we get it on DB.
    const id = new Date().getDate()

    // try to keep payload small, for better user experience
    // just for demo using a basic string. For productions, we have to use long, complex and unguessabl string value.
    const token = jwt.sign({id, username}, process.env.JWT_SECRET, {expiresIn: '30d'})

    res.status(200).json({msg: 'user created', token})
}

const dashboard = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new CustomAPIError('No token provided', 401)
    }

    const token = authHeader.split(' ')[1]
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        throw new CustomAPIError('Not authorized to access this route' ,401)
    }

    const luckyNumber = Math.floor(Math.random() * 100)
    res.status(200).json(
        {
            msg: `Hello, John Doe`, 
            secret: `Here is your authorized data, your lucky number is ${luckyNumber}`}
        )
}

module.exports = {
    login, dashboard
}