import { mockPetlist } from '@/framework/mock/pet'
import { pickForUpdate } from '@/utils/utils'
import ApiRoot from '../fetcher'
import { normalizePetsForApi } from '../lib/normalize'
import apis from '@/framework/config/api-config'

export const updatePet = async (petInfo, primaryData) => {
  let data: any = normalizePetsForApi(petInfo)
  let primaryForApi: any = normalizePetsForApi(primaryData)
  let params = { ...pickForUpdate(data, primaryForApi), id: petInfo.id, subscriptionNo: undefined }


  console.info('updatePet params', data, primaryForApi, params)
  // mockPetlist.forEach((el) => {
  //   debugger
  //   if (el.id === params.id) {
  //     el = Object.assign(el, params)
  //   }
  // })
  // console.info('mockPetlist', mockPetlist)
  try {
    const pets = await ApiRoot({ url: apis.wx_pet }).pets().updatePet({ body: params })
    return pets
  } catch (err) {
    console.log(err)
    return false
  }
}
