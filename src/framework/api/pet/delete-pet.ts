import apis from '@/framework/config/api-config'
import { mockPetlist } from '@/framework/mock/pet'
import ApiRoot from '../fetcher'

export const deletePet = async ({ id }) => {
  console.info('params', id)
  // mockPetlist.forEach((el, index) => {
  //   if (el.id === id) {
  //     mockPetlist.splice(index, 1);
  //   }
  // });
  try {
    return await ApiRoot({ url: apis.wx_pet }).pets().deletePet({ id })
  } catch (err) {
    console.log(err)
    return false
  }
}
