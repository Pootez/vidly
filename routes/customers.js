const Joi = require('Joi')
const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Could not connect to MongoDB:', err))

const Customer = mongoose.model('Customer', mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    number: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 12
    }
}))

router.get('/', async (req, res) => {
    const customer = await Customer.find().sort('name')
    res.send(customer)
})

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)

    if (!customer) return res.status(404).send("No customer related to that id.")
    else {
        res.send(customer)
    }
})

router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        number: req.body.number
    })

    const count = await Customer.find({ number: req.body.number }).count()
    if (count > 0) return res.status(400).send('Already a customer with that number.')

    const result = await customer.save()
    res.send(result)
})

router.put('/:id', async (req, res) => {
    if (req.body.number) {
        const count = await Customer.find({ number: req.body.number }).count()
        if (count > 0) return res.status(400).send('Already a customer with that number.')
    }

    const result = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!result) return res.status(404).send("No customer related to that id.")

    res.send(result)
})

router.delete('/:id', async (req, res) => {
    const result = await Customer.findByIdAndDelete(req.params.id)
    if (!result) return res.status(404).send("No genre with that id.")

    res.send(result)
})

function validateGenre(customer) {
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        isGold: Joi.boolean(),
        number: Joi.string().min(5).max(12).required()
    })

    return schema.validate(customer)
}

module.exports = router