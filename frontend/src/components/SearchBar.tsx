import { FormEvent, useState } from 'react'
import { useSearchContext } from '../context/SearchContext'
import { MdTravelExplore } from 'react-icons/md'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate } from 'react-router-dom'

const SearchBar = () => {
  const search = useSearchContext()
  const navigation = useNavigate()

  const [destination, setDestination] = useState<string>(search.destination)
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn)
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut)
  const [adultCount, setAdultCount] = useState<number>(search.adultCount)
  const [childrenCount, setChildrenCount] = useState<number>(
    search.childrenCount,
  )

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childrenCount,
    )
    navigation('/search')
  }

  const minDate = new Date()
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 1)

  return (
    <form
      onSubmit={handleSubmit}
      className="-mt-8 p-3 bg-orange-400 rounded shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4">
      <div className="flex flex-row items-center flex-1 bg-white p-2">
        <MdTravelExplore size={25} className="mr-2" />
        <input
          type="text"
          placeholder="Where are you going"
          className="text-md w-full focus:outline-none"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>
      <div className="flex bg-white px-2 py-1 gap-2">
        <label className="items-center flex">
          Adults:
          <input
            type="number"
            className="w-full p-1 focus:outline-none font-bold"
            min={1}
            max={20}
            value={adultCount}
            onChange={(e) => setAdultCount(parseInt(e.target.value))}
          />
        </label>
        <label className="items-center flex">
          Child:
          <input
            type="number"
            min={0}
            max={20}
            className="w-full p-1 focus:outline-none font-bold"
            value={childrenCount}
            onChange={(e) => setChildrenCount(parseInt(e.target.value))}
          />
        </label>
      </div>
      <div className="">
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Check-in date"
          className="min-w-full bg-white p-2 focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>
      <div className="">
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Check-in date"
          className="min-w-full bg-white p-2 focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>
      <div className="flex gap-1">
        <button className="w-2/3 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500">
          Search
        </button>
        <button className="w-1/3 bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500">
          Clear
        </button>
      </div>
    </form>
  )
}
export default SearchBar