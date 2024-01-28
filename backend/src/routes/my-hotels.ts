import express, {Request, Response} from 'express'
import multer from 'multer'
import cloudinary from 'cloudinary'
import Hotel, { HotelType } from '../models/hotel'
import verifyToken from '../middleware/auth'
import { body } from 'express-validator'

const router = express.Router()

// TODO:
// пакет который помогает нам обрабатывать изображение
// получаемый  из запроса
// берет поля из двоичного изображения и возвращает нам объект
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

router.post('/', verifyToken, 
[
  body('name').notEmpty().withMessage('Name is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('type').notEmpty().withMessage('Hotel type is required'),
  body('pricePerNight').notEmpty().isNumeric().withMessage('Price Per Night is required'),
  body('facilities').notEmpty().isArray().withMessage('Facilities are required')
  // body('adultCount').notEmpty().isNumeric().withMessage('Adult Count is required'),
  // body('childrenCount').notEmpty().isNumeric().withMessage('Children Count is required'),
  // body('starRating').notEmpty().isNumeric().withMessage('Star Rating is required')
],
upload.array("imageFiles", 6), async (req: Request, res: Response) => {
  try {
    const imageFiles  = req.files as Express.Multer.File[]
    const newHotel: HotelType = req.body

    // TODO:
    // 1. upload the images to cloudinary
    const uploadPromises = imageFiles.map(async(image) => {
      const b64 = Buffer.from(image.buffer).toString("base64")
      let dataURI = "data:" + image.mimetype + ";base64," + b64
      const res = await cloudinary.v2.uploader.upload(dataURI)
      return res.url
    })

    // TODO:
    // дожидаемся загрузки всех наших изображений
    const imagesUrls = await Promise.all(uploadPromises)
 
    // TODO:
    // 2. if upload was successful, add the URLs to the new hotels
    newHotel.imageUrls = imagesUrls
    newHotel.lastUpdate = new Date()
    newHotel.userId = req.userId

    // TODO:
    // 3. save the new hotels in DB
    const hotel = new Hotel(newHotel)
    await hotel.save()

    // TODO:
    // 4. return status (201
    res.status(201).send(hotel)
  } catch (error) {
    console.log("🚀 ~ Error creating hotel, router.post ~ error:", error)
    res.status(500).json({
      message: 'Error creating hotel'
    })
  }
})


export default router