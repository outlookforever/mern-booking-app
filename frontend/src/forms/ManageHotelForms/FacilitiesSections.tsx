import { useFormContext } from 'react-hook-form'
import { hotelFacilities } from '../../config/hotel-options-config'
import { HotelFormData } from './ManageHotelForms'

const FacilitiesSections = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>()

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Facilities</h2>
      <div className="grid grid-cols-4 gap-2">
        {hotelFacilities.map((facility) => (
          <label
            key={facility}
            className="cursor-pointer flex gap-4 font-sm text-gray-700">
            <input
              type="checkbox"
              value={facility}
              {...register('facilities', {
                validate: (facilities) => {
                  if (facilities && facilities.length > 0) {
                    return true
                  } else {
                    return 'At least one facility is required'
                  }
                },
              })}
            />
            <span> {facility}</span>
          </label>
        ))}
      </div>
      {errors.facilities && (
        <span className="text-red-500 font-bold text-sm">
          {errors.facilities.message}
        </span>
      )}
    </div>
  )
}

export default FacilitiesSections
