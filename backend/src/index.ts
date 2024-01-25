import express, {Request, Response} from 'express'
import cors  from "cors";
import "dotenv/config"
import mongoose from 'mongoose'
import userRoutes from './routes/users'
import authRoutes from './routes/auth'
import cookieParser from 'cookie-parser'
import path from 'path';


mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => {
  console.log('Connection to database')
})
.catch((err) => {
  console.log('DB error', err)
})

const app =express()
// TODO: Take cookies from front - Application/Cookies; from back - (req.cookies in middleware/auth/ts)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// TODO: Cookies cors and in frontend fetch + credentials: original (watch api-client in front)!!!!!!!!
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

app.use(express.static(path.join(__dirname, '../../frontend/dist/')))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

app.listen(4200,() => {
    console.log('Sever running on port 4200');
}) 