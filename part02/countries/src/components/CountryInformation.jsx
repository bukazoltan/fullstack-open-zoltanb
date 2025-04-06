import { Country } from "./Country"
import { DetailedCountry } from "./DetailedCountry"

export const CountryInformation = ({countries}) => {
  if (countries.length == 1) {
    let detailedCountry = countries[0]
    return (
        <DetailedCountry country={detailedCountry} />
    )
  }
  return (
    <div>{countries.map(country => <Country key={country.name.official} country={country}/>)}</div>
  )
}
