import express, {Request, Response} from 'express'
import cors  from "cors";
import "dotenv/config"
import mongoose from 'mongoose'
import userRoutes from './routes/users'
import authRoutes from './routes/auth'
import myHotelsRoutes from './routes/my-hotels'
import cookieParser from 'cookie-parser'
import path from 'path';
import { v2 as cloudinary} from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})


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
app.use('/api/my-hotels', myHotelsRoutes)

// TODO: Для Облачных серверов, чтоб работала с одного сервера
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"))
})

app.listen(4200,() => {
    console.log('Sever running on port 4200');
}) 