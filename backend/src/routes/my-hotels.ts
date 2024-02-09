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
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      const imageUrls = await uploadImages(imageFiles);

      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdate = new Date();
      newHotel.userId = req.userId;

      const hotel = new Hotel(newHotel);
      await hotel.save();

      res.status(201).send(hotel);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get('/',verifyToken , async(req: Request, res: Response)=> {
  try {
    const hotels = await Hotel.find({userId: req.userId})

    res.status(200).json(hotels)
    
  } catch (error) {
    console.log("🚀 router/my-hotels.ts ~ router.get ~ error:", error)
    res.status(500).json({message: 'Error fetching hotels'})
  }
})


export default router