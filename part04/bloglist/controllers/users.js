const bcrypt = require('bcryptjs')
const userRouter = require('express').Router()
const User = require("../models/user")

userRouter.get("/", async (req, res) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
    res.send(users).status(200).end()
})

userRouter.post("/", async (req, res, next) => {
    const { username, name, password } = req.body

    if (password.length < 3) {
        return res.status(400).json({ error: 'password is shortern than 3 characters' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser).end()
    
})

module.exports = userRouter