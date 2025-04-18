require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const PhonebookEntry = require('./models/phonebookEntry')

const app = express()

morgan.token('body', function (req) { return JSON.stringify(req.body) })

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

app.get('/api/persons', (req,res) => {
  PhonebookEntry.find({})
    .then(entries => res.json(entries))
    .then(res => res.status(200).end())
})

app.get('/api/persons/:id', (req, res, next) => {
  PhonebookEntry.findById({ _id: req.params.id }).then(correctEntry => {
    if (correctEntry) {
      return res.send(correctEntry).status(200).end()
    }
    return res.status(404).end()
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  PhonebookEntry.findByIdAndDelete({ _id: req.params.id }).then(
    () => res.status(202).end()
  )
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const newPerson = req.body
  const newEntry = new PhonebookEntry({
    name: newPerson.name,
    number: newPerson.number
  })
  newEntry.save()
    .then(savedNewEntry => {
      return res.send(savedNewEntry).status(200).end()}
    ).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const updatedPerson = req.body
  PhonebookEntry.findByIdAndUpdate(req.params.id, updatedPerson)
    .then( () => {
      return res.send(updatedPerson).status(200).end()
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  PhonebookEntry.countDocuments()
    .then(count => {
      res.send(`<p>Phonebook has info for ${count} people</p><p>${Date(Date.now()).toString()}</p>`)
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(process.env.PORT, () => console.log(`Server is running on http://localhost:${process.env.PORT}`))