import { useSearchContext } from '../context/SearchContext'
import * as apiClient from '../api-client'
import { useQuery } from 'react-query'
import { useState } from 'react'
import SearchResultsCard from '../components/SearchResultsCard'
import Pagination from '../components/Pagination'
import StarRatingFilter from '../components/StarRatingFilter'
import HotelTypesFilter from '../components/HotelTypesFilter'
import FacilitiesFilter from '../components/FasilitiesFilter'
import PriceFIlter from '../components/PriceFIlter'

const Search = () => {
  const search = useSearchContext()
  const [page, setPage] = useState<number>(1)
  const [selectedStars, setSelectedStars] = useState<string[]>([])
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([])
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([])
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>()

  //TODO: берем данные из формы поиска
  // и преобразуем в объект параметров поиска
  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    childrenCount: search.childrenCount.toString(),
    adultCount: search.adultCount.toString(),
    page: page.toString(),
    // TODO: Фильтры
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacilities,
    maxPrice: selectedPrice?.toString(),
  }

  // TODO: ['searchHotels', searchParams] - походу это массив зависимостей
  // при которых переотправляется запрос
  const { data: hotelData } = useQuery(['searchHotels', searchParams], () =>
    apiClient.searchHotels(searchParams),
  )

  const handleStarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startRating = e.target.value

    setSelectedStars((prevStars) =>
      e.target.checked
        ? [...prevStars, startRating]
        : prevStars.filter((star) => star !== startRating),
    )
  }

  const handleHotelTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const hotelType = event.target.value

    setSelectedHotelTypes((prevHotelTypes) =>
      event.target.checked
        ? [...prevHotelTypes, hotelType]
        : prevHotelTypes.filter((hotel) => hotel !== hotelType),
    )
  }

  const handleFacilitiesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const facility = event.target.value

    setSelectedFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, facility]
        : prevFacilities.filter((prevFacility) => prevFacility !== facility),
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
          {/* FIXME: Filters */}
          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleStarsChange}
          />
          <HotelTypesFilter
            selectedHotelTypes={selectedHotelTypes}
            onChange={handleHotelTypeChange}
          />
          <FacilitiesFilter
            selectedFacilities={selectedFacilities}
            onChange={handleFacilitiesChange}
          />
          <PriceFIlter
            selectedPrice={selectedPrice}
            onChange={(value?: number) => setSelectedPrice(value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {hotelData?.pagination.total} Hotels found
            {search.destination ? ` in ${search.destination}` : ''}
          </span>
          {/* FIXME: Sort options */}
        </div>
        {hotelData?.data.map((hotel) => (
          <SearchResultsCard key={hotel._id} hotel={hotel} />
        ))}
        {/* FIXME: pagination */}
        <div>
          <Pagination
            page={hotelData?.pagination.page || 1}
            pages={hotelData?.pagination.pages || 1}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  )
}

export default Search
