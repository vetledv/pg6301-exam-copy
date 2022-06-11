import express, { Express } from 'express'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { LoginRouter } from './LoginRouter'

dotenv.config()

export const app: Express = express()
export const mongoClient = new MongoClient(process.env.MONGO_URL as string)

app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use('/api/login', LoginRouter)
