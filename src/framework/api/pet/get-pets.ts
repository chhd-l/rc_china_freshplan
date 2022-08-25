import apis from '@/framework/config/api-config'
// import { ApiRoot } from "../../fetcher";
import { mockPetlist } from '@/framework/mock/pet'
import ApiRoot from '../fetcher'
// import ApiRoot from '@/rc-china-commerce/packages/taro/lib'
import { normalizePetsForFe } from '../lib/normalize'

export const getPets = async ({ consumerId }) => {
  try {
    const pets = await ApiRoot({ url: apis?.common_pet }).pets().getPets({ consumerId })
    // const pets = mockPetlist;
    console.info('petspetspetspets', pets)
    return (pets || []).map((pet) => normalizePetsForFe(pet))
  } catch (err) {
    console.log(err, 'err')
    return []
  }
}

export const getPet = async (id: string) => {
  try {
    const data = await ApiRoot({ url: apis?.common_pet }).pets().getPet({ id })
    // const pets = mockPetlist;
    console.info('petspetspetspets', data.consumerPetGet)
    return data?.consumerPetGet ? normalizePetsForFe(data.consumerPetGet) : null
  } catch (err) {
    console.log(err, 'err')
    return null;
  }
}

export const getSubsByPetId = async (petId: string) => {
  try {
    const data = await ApiRoot({ url: apis?.common_pet }).pets().getSubscriptionsByPet(petId)
    return data;
  } catch (err) {
    console.log(err, 'err')
    return [];
  }
}
