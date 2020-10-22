const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res)=> {
    const body = req.body

    const foundUser = await User.findOne({ username: body.username})

    const passwordCorrect = foundUser === null
        ? false
        : await bcrypt.compare(body.password, foundUser.passwordHash)

    if(!(foundUser && passwordCorrect)){
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userToken = {
        username: foundUser.username,
        id: foundUser._id
    }

    const token = jwt.sign(userToken, process.env.SECRET)

    res
        .status(200)
        .send({token, username: foundUser.username, name: foundUser.name})
})




module.exports = loginRouter