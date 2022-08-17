// import { ApiRoot } from "../../fetcher";
import { mockPetlist } from '@/framework/mock/pet'
import ApiRoot, { baseSetting } from '../fetcher'
// import ApiRoot from '@/rc-china-commerce/packages/taro/lib'
import { normalizePetsForFe } from '../lib/normalize'
import apis from '@/framework/config/api-config'
import Taro from '@tarojs/taro'

export const getBreedList = async () => {
  let params = { storeId: baseSetting.storeId }
  try {
    // breedList 优先从缓存中取
    const cache = Taro.getStorageSync('breedList');
    if (cache && cache?.length > 0) {
      console.log('breeeeeed:', cache);
      return Promise.resolve(cache);
    }
    const breeds = await ApiRoot({ url: apis?.wx_pet }).pets().getBreeds({ body: params })
    // const breeds = mockPetlist;
    Taro.setStorageSync("breedList", breeds);
    return breeds
  } catch (err) {
    return []
  }
}