const {Customer, validateGenre} = require('../models/customer')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const express = require('express')
const router = express.Router()

router.get('/', auth, async (req, res) => {
    const customer = await Customer.find().sort('name')
    res.send(customer)
})

router.get('/:id', auth, async (req, res) => {
    const customer = await Customer.findById(req.params.id)

    if (!customer) return res.status(404).send("No customer related to that id.")
    else {
        res.send(customer)
    }
})

router.post('/', auth, async (req, res) => {
    const { error } = validateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    })

    const count = await Customer.find({ phone: req.body.phone }).count()
    if (count > 0) return res.status(400).send('Already a customer with that number.')

    const result = await customer.save()
    res.send(result)
})

router.put('/:id', auth, async (req, res) => {
    if (req.body.phone) {
        const count = await Customer.find({ phone: req.body.phone }).count()
        if (count > 0) return res.status(400).send('Already a customer with that number.')
    }

    const result = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!result) return res.status(404).send("No customer related to that id.")

    res.send(result)
})

router.delete('/:id', [auth, admin], async (req, res) => {
    const result = await Customer.findByIdAndDelete(req.params.id)
    if (!result) return res.status(404).send("No genre with that id.")

    res.send(result)
})

module.exports = router