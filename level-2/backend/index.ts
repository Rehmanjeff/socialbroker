import express from 'express'
import bodyParser from 'body-parser'
import { checkAvailability } from './controllers/SocialMediaController'
import { body, check } from 'express-validator'

const cors = require('cors')
const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(bodyParser.json())

const validatePostData = [
    body('id').isNumeric().withMessage('ID must be a number'),
    body('url').isURL().withMessage('URL must be a valid URL'),
    body('username').notEmpty().withMessage('Username is required')
]

app.post('/check-availability', validatePostData, checkAvailability)

// Start the server
const port = 3001
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
