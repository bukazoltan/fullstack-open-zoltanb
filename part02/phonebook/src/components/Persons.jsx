import React from 'react'
import { Contact } from './Contact'

export const Persons = ({persons, deleteContact}) => {
  return (
    <div>{persons.map(person => <Contact key={person.name} person={person} deleteContact={deleteContact}/>)}</div>
  )
}
