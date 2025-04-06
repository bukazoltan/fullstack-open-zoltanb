const Anecdote = ({anecdote, voteCount}) => {
    return <div>
        <p>{anecdote}</p>
        <p>has {voteCount} votes</p>
    </div>
}

export default Anecdote;