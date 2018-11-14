const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const passport = require('passport')

const users = require('./routes/api/users')
const salesmen = require('./routes/api/salesmen')
const sales = require('./routes/api/sales')

const app = express()

const db = require('./config/keys').mongoURI

mongoose
    .connect(db, {
        useNewUrlParser: true
    })
    // eslint-disable-next-line no-console
    .then(() => console.log('MongoDB Connected')) 
    // eslint-disable-next-line no-console
    .catch(err => console.log(err))

app.use(passport.initialize())

require('./config/passport')(passport)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'))

app.get('/', (req, res) => res.send('Hello World'))

app.use('/api/users', users)
app.use('/api/salesmen', salesmen)
app.use('/api/sales', sales)

// eslint-disable-next-line no-undef
const port = process.env.PORT || 5000

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server running on port ${port}`))