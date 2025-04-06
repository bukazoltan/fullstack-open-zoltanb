import { useState, useEffect } from 'react'
import axios, { Axios } from 'axios'
import { CountryInformation } from './components/CountryInformation'

function App() {
  const [countries, setCountries] = useState(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all").then(response => setCountries(response.data))
  }, [])

  if (!countries) return null

  let filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <div>find countries <input onChange={e => setFilter(e.target.value)} type="text" /></div>
      <div>
        {
          filteredCountries.length > 10 ? <div>Too many matches, specify another filter</div> : <CountryInformation countries={filteredCountries}/>
        }
      </div>
    </div>
  )
}

export default App
