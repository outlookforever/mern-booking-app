export type HotelType = {
  _id: string
  userId: string
  name: string
  city: string
  country: string
  description: string
  type: string
  adultCount: number
  childrenCount: number
  facilities: string[]
  pricePerNight: number
  starRating: number
  imageUrls: string[]
  lastUpdate: Date
}

export type HotelSearchResponse = {
  data: HotelType[],
  pagination: {
    total: number,
    page: number,
    pages: number
  }
}