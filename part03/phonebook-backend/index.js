require('dotenv').config()
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const PhonebookEntry = require('./models/phonebookEntry')

app = express()

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

let data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (req,res) => {
  PhonebookEntry.find({})
                .then(entries => res.json(entries))
                .then(res => res.status(200).end())
})

app.get("/api/persons/:id", (req, res) => {
    PhonebookEntry.findOne({_id: req.params.id}).then(correctEntry => {
      if (correctEntry) {
        return res.send(correctEntry).status(200).end()
      }
      return res.status(404).end()
    })
})

app.delete("/api/persons/:id", (req, res) => {
    PhonebookEntry.deleteOne({_id: req.params.id}).then(
      () => res.status(202).end()
    )
    
})

app.post("/api/persons", (req, res) => {
    const newPerson = req.body;
    const newEntry = new PhonebookEntry({
      name: newPerson.name,
      number: newPerson.number
    })
    newEntry.save().then(savedNewEntry => {
      return res.send(savedNewEntry).status(200).end()
    })
})

app.get("/info", (req, res) => res.send(`<p>Phonebook has info for ${data.length} people</p><p>${Date(Date.now()).toString()}</p>`))

app.listen(process.env.PORT, () => console.log(`Server is running on http://localhost:${process.env.PORT}`))