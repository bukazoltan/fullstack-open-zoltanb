const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const PORT = process.env.PORT || 3001
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

app.get("/api/persons", (req,res) => res.send(data).status(200).end())

app.get("/api/persons/:id", (req, res) => {
    const correctEntry = data.find((item) => item.id == req.params.id)
    if (correctEntry) {
        return res.send(correctEntry).status(200).end()
    }
    return res.status(404).end()
})

app.delete("/api/persons/:id", (req, res) => {
    data = data.filter(item => item.id != req.params.id)
    return res.status(202).end()
})

app.post("/api/persons", (req, res) => {
    const newPerson = req.body;
    const newId = Math.floor(Math.random() * 99999999)
    const newObject = {id: newId, ...newPerson}
    if (!Object.keys(newPerson).includes("name") || !Object.keys(newPerson).includes("number")){
        return res.status(400).send({"error": "name or number is not included"})
    }
    if (data.find(person => person.name == newPerson.name)) {
        return res.status(400).send({"error": "name must be unique"})
    }
    data.push(newObject)
    return res.send(newObject).status(200).end()
})

app.get("/info", (req, res) => res.send(`<p>Phonebook has info for ${data.length} people</p><p>${Date(Date.now()).toString()}</p>`))

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))