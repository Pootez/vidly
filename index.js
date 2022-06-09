const morgan = require('morgan')
const express = require('express')
const app = express()
const Joi = require('joi')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
    console.log('Morgan enabled in development...')
}

let genreNames = ["horror", "comedy", "action", "drama", "romance", "thriller", "sci-fi", "fantasy", "mystery", "animation", "adventure", "crime", "documentary", "family", "history", "music", "war", "western"]
let genres = []
genreNames.forEach(obj => {
    genres.push({
        id: genres.length,
        name: obj
    })
})

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/genres', (req, res) => {
    res.send(genres)
})

app.get('/genres/:query', (req, res) => {
    let genre = genres.find(obj => obj.id === parseInt(req.params.query))
    if (!genre) genre = genres.find(obj => obj.name === req.params.query)

    if (!genre) return res.status(404).send("No genre related to that query.")

    res.send(genre)
})

app.post('/genres', (req, res) => {
    const { error } = validateGenre(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    if (genres.find(obj => obj === req.body.name)) return res.status(400).send('Genre already exists.')

    const genre = {
        id: genres.length,
        name: req.body.name
    }
    genres.push(genre)
    res.send(genre)
})

app.put('/genres', (req, res) => {
    let target = genres.find(obj => obj.id === parseInt(req.body.id))
    if (!target) return res.status(404).send("No genre with that id.")

    const { error } = validateGenre({ name: req.body.name })
    if (error) return res.status(400).send(error.details[0].message)

    const genre = {
        id: req.body.id,
        name: req.body.name
    }
    const index = genres.indexOf(target)
    genres[index] = genre
    res.send(genre)
})

app.delete('/genres', (req, res) => {
    let target = genres.find(obj => obj.id === parseInt(req.body.id))
    if (!target) return res.status(404).send("No genre with that id.")

    const index = genres.indexOf(target)
    genres.splice(index, 1)

    res.send(target)
})

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })

    return schema.validate(genre)
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))