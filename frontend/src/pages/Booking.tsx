import { useQuery } from 'react-query'
import * as apiClient from '../api-client'
import BookingForm from '../forms/BookingForm/BookingForm'
import { useSearchContext } from '../context/SearchContext'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import BookingDetailSummary from '../components/BookingDetailSummary'

const Booking = () => {
  const search = useSearchContext()
  const { hotelId } = useParams()

  const [numberOfNights, setNumberOfNights] = useState<number>(0)

  useEffect(() => {
    const nights =
      Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
      (1000 * 60 * 60 * 24)
    setNumberOfNights(Math.ceil(nights))
  }, [search.checkOut, search.checkIn])

  const { data: currentUser } = useQuery(
    'fetchCurrentUser',
    apiClient.fetchCurrentUser,
  )

  const { data: hotel } = useQuery(
    'fetchMyHotelById',
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    },
  )

  if (!hotel) {
    return <></>
  }

  return (
    <div className="grid md:grid-cols-[1fr_2fr] gap-1">
      <BookingDetailSummary
        checkOut={search.checkOut}
        checkIn={search.checkIn}
        adultCount={search.adultCount}
        childrenCount={search.childrenCount}
        numberOfNights={numberOfNights}
        hotel={hotel}
      />
      {currentUser && <BookingForm currentUser={currentUser} />}
    </div>
  )
}

export default Booking
