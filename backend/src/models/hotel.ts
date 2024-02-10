import mongoose from 'mongoose'
import { HotelType } from '../shared/types'



const hotelSchema = new mongoose.Schema<HotelType>({
  userId:{
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  adultCount: {
    type: Number,
    required: true,
  },
  childrenCount: {
    type: Number,
    required: true
  },
  facilities:[{
    type: String,
    required: true
  }],
  pricePerNight: {
    type: Number,
    required: true
  },
  starRating: {
    type: Number,
    required: true,
    min:1, 
    max: 5
  },
  imageUrls:[{
    type: String,
    required: true
  }],
  lastUpdate: {
    type: Date,
    required: true
  }
})

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema)
export default Hotel