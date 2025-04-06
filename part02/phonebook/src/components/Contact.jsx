import React from 'react'

export const Contact = ({person, deleteContact}) => {
  return (
    <div>
        <p>{person.name} -- {person.number} <button onClick={() => deleteContact(person)}>Remove</button></p>
    </div>
  )
}
