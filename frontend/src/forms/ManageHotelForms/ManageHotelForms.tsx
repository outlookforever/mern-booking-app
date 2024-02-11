import { FormProvider, useForm } from 'react-hook-form'
import DetailsSection from './DetailsSection'
import TypeSection from './TypeSection'
import FacilitiesSections from './FacilitiesSections'
import GuestSection from './GuestSection'
import ImagesSections from './ImagesSections'
import { HotelType } from '../../../../backend/src/shared/types'
import { useEffect } from 'react'

export type HotelFormData = {
  userId: string
  name: string
  city: string
  country: string
  description: string
  type: string
  pricePerNight: number
  starRating: number
  facilities: string[]
  imageFiles: FileList
  imageUrls: string[]
  adultCount: number
  childrenCount: number
}

type Props = {
  onSave: (hotelFormData: FormData) => void
  isLoading: boolean
  hotel?: HotelType
}

const ManageHotelForms = ({ onSave, isLoading, hotel }: Props) => {
  const formMethod = useForm<HotelFormData>()
  const { handleSubmit, reset } = formMethod

  // TODO: с помощью этого подставляются данные при редактировании
  useEffect(() => {
    reset(hotel)
  }, [hotel, reset])

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    // TODO:
    // перед отправкой необходимо нашу форму преобразовать в json
    const formData = new FormData()

    // TODO: для редактирования страницы
    if (hotel) {
      formData.append('hotelId', hotel._id)
    }
    formData.append('name', formDataJson.name)
    formData.append('city', formDataJson.city)
    formData.append('country', formDataJson.country)
    formData.append('description', formDataJson.description)
    formData.append('type', formDataJson.type)
    formData.append('pricePerNight', formDataJson.pricePerNight.toString())
    formData.append('starRating', formDataJson.starRating.toString())
    formData.append('adultCount', formDataJson.adultCount.toString())
    formData.append('childrenCount', formDataJson.childrenCount.toString())

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility)
    })

    // TODO: для редактирования страницы
    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url)
      })
    }

    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile)
    })

    onSave(formData)
  })

  return (
    <FormProvider {...formMethod}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitiesSections />
        <GuestSection />
        <ImagesSections />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 fon-bold hover:bg-blue-500 transition-all text-xl disabled:bg-gray-500">
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </span>
      </form>
    </FormProvider>
  )
}

export default ManageHotelForms
