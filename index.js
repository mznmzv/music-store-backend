import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import authRouter from './routes/auth-router.js'
import releaseRouter from './routes/release-router.js'
import dealRouter from './routes/deal-router.js'
import fileUpload from 'express-fileupload'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
dotenv.config()

const PORT = process.env.PORT || 3009
const DB_NAME = process.env.DB_NAME
const DB_URL = process.env.DB_URL

// Middleware
app.use(cors())
app.use(express.json())
app.use(fileUpload())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', authRouter)
app.use('/api/release', releaseRouter)
app.use('/api/deal', dealRouter)

async function start() {
    try {
        await mongoose.connect(`${DB_URL}/${DB_NAME}`)

        app.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()
