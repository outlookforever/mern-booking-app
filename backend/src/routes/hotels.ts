import express, {Request, Response} from 'express'
import Hotel from '../models/hotel'
import { HotelSearchResponse } from '../shared/types'
import { param, validationResult } from 'express-validator';
import Stripe from 'stripe'
import verifyToken from '../middleware/auth';

const stripe = new Stripe(process.env.STRIPE_API_KEY as string)

const router = express.Router()

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

// TODO: /api/hotels/search
router.get('/search', async(req: Request, res: Response) => {
  try {
    // TODO: Filter and Sort
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    // TODO::. Pagination
    const pageSize = 5
    const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1")
    const skip = (pageNumber - 1) * pageSize
    
    // TODO: Здесь важен порядок
    const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize)

    const total = await Hotel.countDocuments(query)

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize)
      }
    }

    res.status(200).json(response)
  } catch (error) {
    console.log("🚀 routes/hotels.ts ~ router.get ~ error:", error)
    res.status(500).json({
      message: 'Something went wrong'
    }) 
  }
})

router.get('/:id', 
  [param("id").notEmpty().withMessage('Hotel ID is required')],
  async (req:Request, res: Response) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }

  const id = req.params.id.toString()

  try {
    const hotel = await Hotel.findById(id)

    if(!hotel) {
      return res.status(400).json({
        message: 'Hotel not found'
      })
    }
    
    res.status(200).json(hotel)
  } catch (error) {
    console.log("🚀 hotels.ts ~ router.get ~ error:", error)
    res.status(500).json({
      message: 'Error fetching hotel'
    })
    
  }
})

// TODO: /api/hotels
router.post('/:hotelId/bookings/payment-intent', verifyToken, async(req: Request, res: Response) => {
  // TODO: 
  // 1 total coast
  // 2 hotelId
  // 3 userId

  const hotelId = req.params.hotelId
  const {numberOfNights} = req.body


  const hotel = await Hotel.findById(hotelId)
  if (!hotel) {
    return res.status(400).json({
      message: 'Hotel not found'
    })
  } 
  const totalCoast = hotel.pricePerNight * numberOfNights 

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCoast,
    currency: 'usd',
    metadata: {
      hotelId,
      userId: req.userId
    }
  })

  if(!paymentIntent.client_secret) {
    return res.status(500).json({
      message: 'Error creating payment intent'
    })
  }

  const response = {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret.toString(),
    totalCoast
  }

  res.send(response)
})




export default router

