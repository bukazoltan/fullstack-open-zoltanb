const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const phonebookEntrySchema = new mongoose.Schema({
  name: String,
  number: String
})

const PhonebookEntry = mongoose.model('PhonebookEntry', phonebookEntrySchema)

const addPhoneNumber = (name, number, connectionUrl) => {
  mongoose.connect(connectionUrl)

  const newEntry = new PhonebookEntry({
    name: name,
    number: number
  })

  newEntry.save().then(() => {
    console.log('New entry saved!')
    mongoose.connection.close()
  })
}

const listPhoneNumbers = (connectionUrl) => {
  mongoose.connect(connectionUrl)

  PhonebookEntry.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(entry => {
      console.log(`${entry.name} -- ${entry.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length >= 3) {
  const password = process.argv[2]
  const url = `mongodb+srv://mongodbdemeanor715:${password}@fullstackopen.h7ifdw2.mongodb.net/phonebook?retryWrites=true&w=majority&appName=FullStackOpen`

  if (process.argv.length === 3) {
    listPhoneNumbers(url)
  }
  else if (process.argv.length < 5) {
    console.log('Not all arguments provided')
  }
  else {
    const name = process.argv[3]
    const number = process.argv[4]
    addPhoneNumber(name, number, url)
  }
}
else {
  console.log('Error')
}