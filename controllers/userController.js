
const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.post('/', async (req,res) => {
    const body = req.body;

    let existingUser = await User.findOne({username: body.username})

    if(existingUser){
        return res.status(400).json({
            error: 'username must be unique'
        }).end()

    }

    else if(body.password.length < 3 || body.username.length < 3){
        return res.status(400).json({
            error: 'password must be at least 3 characters long'
        }).end()
    }

    const salt = 10;

    const passwordHash = await bcrypt.hash(body.password, salt)

    let newUser = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    let savedUser = await newUser.save()

    res.json(savedUser)

})

userRouter.get('/', async (req,res)=>{
    let totalUsers = await User.find({}).populate('blogs', {url:1 , title:1, author:1})

    res.json(totalUsers)
})

module.exports = userRouter