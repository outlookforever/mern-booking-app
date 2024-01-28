import { useFormContext } from 'react-hook-form'
import { HotelFormData } from './ManageHotelForms'

const GuestSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>()
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Guests</h2>
      <div className="flex gap-4 p-6 bg-gray-200">
        <label className="text-gray-700 text-sm font-bold flex-1">
          Adults
          <input
            type="number"
            min={1}
            {...register('adultCount', { required: 'This field is required' })}
            className="border rounded w-full py-1 px-2 font-normal"
          />
          {errors.adultCount && (
            <span className="text-red-400">{errors.adultCount.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Children
          <input
            type="number"
            min={0}
            {...register('childrenCount', {
              required: 'This field is required',
            })}
            className="border rounded w-full py-1 px-2 font-normal"
          />
          {errors.childrenCount && (
            <span className="text-red-400">{errors.childrenCount.message}</span>
          )}
        </label>
      </div>
    </div>
  )
}

export default GuestSection
