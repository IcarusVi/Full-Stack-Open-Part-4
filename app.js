require('express-async-errors')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleWare = require('./utils/middleware')
const blogRouter = require('./controllers/blogController')
const userRouter = require('./controllers/userController')
const loginRouter = require('./controllers/loginRouter')

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

logger.info('Connecting to MongoDB')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        logger.info('Successfully connected to MongoDB')
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB: ', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleWare.requestLogger)

app.use(middleWare.tokenExtractor)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleWare.unknownEndPoint)
app.use(middleWare.errorHandler)

module.exports = app