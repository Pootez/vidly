const { User } = require('../models/user')
const auth = require('../middleware/auth')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const express = require('express')
const router = express.Router()

router.get('/', auth, async (req, res) => {
    const users = await User.find().sort('name')
    res.send(users)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details.map(obj => obj.message))

    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Invalid email or password.')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid email or password.')

    const token = user.generateAuthToken()
    res.send(token)
})

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(2).max(255).email().required(),
        password: Joi.string().min(2).max(255).required()
    })

    return schema.validate(req)
}

module.exports = router