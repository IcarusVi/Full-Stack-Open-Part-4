const { response } = require('express')
const logger = require('./logger')

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:  ', req.path)
    logger.info('Body:  ', req.body)
    logger.info('---')
    next()
}

const unknownEndPoint = (req, res) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'invalid token'
        })
    }
    logger.error(error.message)
    next(error)
}


const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    req.token = null
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
        req.token = authorization.substring(7)
    }
    next()
}




module.exports = {
    requestLogger,
    unknownEndPoint,
    errorHandler,
    tokenExtractor
}