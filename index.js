const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

const logger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(logger)

// teht 3.10
const mongoose = require('mongoose')

// ympäristömuuttujien käyttöönotto
if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url)

const Reminder = require('./models/reminder')  // otetaan moduulista ulos Reminderin määrittely

// teht 3.10
const formatReminder = (reminder) => {
  return {
    name: reminder.name,
    timestamp: reminder.timestamp,
    id: reminder.id
  }
}

let reminders = [
  {
    "name": "Buy some eggs",
    "timestamp": "2021-11-10T13:00:00.141Z",
    // "id": 1
  },
  {
    "name": "Make an omelette",
    "timestamp": "2021-11-11T08:00:00.141Z",
    // "id": 2
  },
  {
    "name": "Wash dishes",
    "timestamp": "2021-11-11T09:00:00.000Z",
    // "id": 3
  },
  {
    "name": "Buy more eggs",
    "timestamp": "2021-11-11T13:00:00.000Z",
    // "id": 4
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/reminders', (req, res) => {
  Reminder
    .find({})
    .then(reminders => {
      res.json(reminders.map(formatReminder))
    })
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })
})

// tehtävä 3.10
app.get('/reminders/:id', (request, response) => {
  Reminder
    .findById(request.params.id)
    .then(reminder => {
      response.json(formatReminder(reminder))
    })
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })

  const id = Number(request.params.id)
  const reminder = reminders.find(reminder => reminder.id === id)

  if (reminder) {
    response.json(reminder)
  } else {
    response.status(404).end()
  }
})

// tehtävä 3.3
app.delete('/reminders/:id', (request, response) => {
  Reminder
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

// teht 3.5
// const generateId = () => {
//   const maxId = reminders.length > 0 ? reminders.map(n => n.id).sort((a, b) => a - b).reverse()[0] : 1
//   return maxId + 1
// }

// tehtävä 3.4 ja 3.5
app.post('/reminders', (request, response) => {
  const body = request.body

  if (body.timestamp === undefined) {
    return response.status(400).json({ error: 'timestamp missing' })
  }

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (reminders.map(note => note.name).includes(body.name)) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const reminder = new Reminder({
    name: body.name,
    timestamp: body.timestamp,
    // id: generateId()
  })

  reminder
    .save()
    .then(savedReminder => {
      response.json(formatReminder(savedReminder))
    })
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })

})

// tässä tapauksessa koodin sijainnilla on väliä !!!
// jos error sijoitettu ennen get-metodia, niin error
// ylikirjoittaa kaikki get-kutsut
// tässä ratkaiseva rivi on app.use(error)
const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



