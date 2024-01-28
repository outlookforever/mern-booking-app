import { FormProvider, useForm } from 'react-hook-form'
import DetailsSection from './DetailsSection'
import TypeSection from './TypeSection'
import FacilitiesSections from './FacilitiesSections'
import GuestSection from './GuestSection'
import ImagesSections from './ImagesSections'

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

const ManageHotelForms = () => {
  const formMethod = useForm<HotelFormData>()
  const { handleSubmit } = formMethod

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    // TODO:
    // перед отправкой необходимо нашу форму преобразовать в json
    const formData = new FormData()
    formData.append('name', formDataJson.name)
    formData.append('city', formDataJson.city)
    formData.append('name', formDataJson.name)
    formData.append('description', formDataJson.description)
    formData.append('type', formDataJson.type)
    formData.append('pricePerNight', formDataJson.pricePerNight.toString())
    formData.append('starRating', formDataJson.starRating.toString())
    formData.append('adultCount', formDataJson.adultCount.toString())
    formData.append('childrenCount', formDataJson.childrenCount.toString())

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility)
    })

    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFile`, imageFile)
    })
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
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 fon-bold hover:bg-blue-500 transition-all text-xl">
            Save
          </button>
        </span>
      </form>
    </FormProvider>
  )
}

export default ManageHotelForms
