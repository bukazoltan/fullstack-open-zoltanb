import { useState } from 'react'
import { DetailedCountry } from './DetailedCountry'

export const Country = ({country}) => {
  const [showDetails, setShowDetails] = useState(false)
  
  return (
    <div>
        {
        showDetails ? <DetailedCountry country={country}/> : <div>{country.name.common}</div>
        }<button onClick={() => setShowDetails(!showDetails)}>{showDetails ? "Hide" : "Show"}</button>
    </div>
  )
}
