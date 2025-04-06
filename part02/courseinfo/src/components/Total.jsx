import React from 'react'

export const Total = ({parts}) => {
  return (
    <div>total of {parts.reduce((s, p) => s + p.exercises, 0)} exercises</div>
  )
}
