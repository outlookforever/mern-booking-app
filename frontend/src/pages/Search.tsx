import { useSearchContext } from '../context/SearchContext'
import * as apiClient from '../api-client'
import { useQuery } from 'react-query'
import { useState } from 'react'
import SearchResultsCard from '../components/SearchResultsCard'

const Search = () => {
  const search = useSearchContext()
  const [page, setPage] = useState<number>(1)

  //TODO: берем данные из формы поиска
  // и преобразуем в объект параметров поиска
  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    childrenCount: search.childrenCount.toString(),
    adultCount: search.adultCount.toString(),
    page: page.toString(),
  }

  const { data: hotelData } = useQuery(['searchHotels', searchParams], () =>
    apiClient.searchHotels(searchParams),
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
          {/* FIXME: Filters */}
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
      </div>
    </div>
  )
}

export default Search
