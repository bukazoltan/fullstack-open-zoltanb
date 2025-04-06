import React from 'react'

export const PersonForm = ({addContact, setNewName, setNewNumber}) => {
  return (
    <form onSubmit={addContact}>
        <div>
          name: <input onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number: <input onChange={(e) => setNewNumber(e.target.value)}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}
