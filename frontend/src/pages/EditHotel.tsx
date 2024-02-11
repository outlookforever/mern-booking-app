import { useMutation, useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import * as apiClient from '../api-client'
import ManageHotelForms from '../forms/ManageHotelForms/ManageHotelForms'

const EditHotel = () => {
  const { hotelId } = useParams()

  const { data: hotel } = useQuery(
    'fetchMyHotelById',
    () => apiClient.fetchMyHotelById(hotelId || ''),
    {
      // TODO: запрос будет выполнен если есть hotelId
      enabled: !!hotelId,
    },
  )

  const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
    onSuccess: () => {},
    onError: () => {},
  })

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData)
  }

  return (
    <ManageHotelForms hotel={hotel} onSave={handleSave} isLoading={isLoading} />
  )
}

export default EditHotel
