import { useState, useEffect } from 'react'
import { Contact } from './components/Contact'
import { Filter } from './components/Filter'
import { PersonForm } from './components/PersonForm'
import personService from "./services/personService"
import { Persons } from './components/Persons'
import { Notification } from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState(null)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [statusMessage, setStatusMessage] = useState(null)

  useEffect(
    () => {
      personService.getAll().then(data => setPersons(data))
    },
    []
  )

  if (!persons) {
    return null
  }

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  const addContact = (e) => {
    e.preventDefault()
    let personsCopy = [...persons]
    let existingWithSameName = persons.find((person) => person.name == newName)

    if (existingWithSameName) {
      let toBeReplaced = confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)
      if (toBeReplaced) {
        let updatedPerson = {...existingWithSameName, number: newNumber}
        personService.updateOne(updatedPerson.id, updatedPerson).then(updated => {
          let updatedIndex = persons.findIndex(person => person.id == updated.id)
          let personsCopy = [...persons]
          personsCopy[updatedIndex] = updated
          setPersons(personsCopy)
        })
      }
      return
    }
    personService.create({"name": newName, "number": newNumber}).then(newPerson => {
      personsCopy.push(newPerson)
      setPersons(personsCopy)
      setStatusMessage({text: `Added ${newPerson.name}`, type: 'status'})
      setTimeout(() => setStatusMessage(null), 3000)
    })
    
  }

  const deleteContact = (person) => {
    let confirmed = window.confirm(`Delete ${person.name}?`)
    if (confirmed) {
      personService.deleteOne(person.id).then(data => {
        let personsWithoutRemoved = persons.filter(p => p.id != person.id)
        setPersons(personsWithoutRemoved)
      }).catch(error => {
        setStatusMessage({text: `Information of ${person.name} has already been removed from server`, type: 'error'})
        setTimeout(() => setStatusMessage(null), 3000)
      })
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={statusMessage}/>
      <Filter setFilter={setFilter} />
      <h2>Add a new</h2>
      <PersonForm addContact={addContact} setNewName={setNewName} setNewNumber={setNewNumber}/>
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deleteContact={deleteContact}/>
    </div>
  )
}

export default App