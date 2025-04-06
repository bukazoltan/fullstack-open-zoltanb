import React from 'react'

export const Notification = ({message}) => {
    if (!message) {
        return null
    }

    return (
        <div className={message.type}>{message.text}</div>
    )
}
