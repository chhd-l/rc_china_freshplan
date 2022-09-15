import { PetListItemProps, PetGender } from '@/framework/types/consumer'
import { consumerAtom } from '@/store/consumer'
import { getPets } from '@/framework/api/pet/get-pets'
import { getAge } from '@/utils/utils'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { CDNIMGURL2 } from '@/lib/constants'
import { useAtom } from 'jotai'
import { useState } from 'react'
import './index.less'

const PetList = () => {
  const [petList, setPetList] = useState<PetListItemProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  // const { router } = getCurrentInstance()
  const [consumerInfo] = useAtom(consumerAtom)
  // const { system } = Taro.getSystemInfoSync()

  const getList = async () => {
    setLoading(true)
    let res = (await getPets({ consumerId: consumerInfo?.id })) || []
    console.log('resxxxxxxxxxxxxx', res)
    res.forEach((item) => {
      item.age = getAge(item.birthday)
    })
    setPetList(res)
    setLoading(false)
  }

  const addPet = () => {
    // petList.push(initNewPet)
    // SetshowAddPetBtn(false)
    // setPetList(cloneDeep(petList))
    Taro.setStorageSync("add-pet-first", 1); //从宠物列表进入，先添加宠物再进行推荐
    Taro.navigateTo({ url: '/pages/packageA/petEdit/index' })
  }

  const petDetail = (pet: PetListItemProps) => {
    Taro.navigateTo({
      url: '/pages/packageA/petDetail/index',
      success: (res) => {
        res.eventChannel.emit('petFromList', pet);
      }
    });
  }

  Taro.useDidShow(() => {
    getList()
  });

  return (
    <>
      <View className="pet-list pb-8">
        {petList.map((pet, idx) => {
          return (
            // <PetItem
            //   showAddPetBtn
            //   key={pet.id}
            //   SetshowAddPetBtn={() => {}}
            //   getList={getList}
            //   pet={pet}
            //   petIdx={idx}
            //   petList={petList}
            //   setPetList={setPetList}
            // />
            <View key={idx} className="m-1 flex bg-white rounded-sm p-1 items-center block-boxshadow" onClick={() => petDetail(pet)}>
              <View className="pet-image rounded-full overflow-hidden">
                <Image src={pet.image} mode="widthFix" />
              </View>
              <View className="flex-1 mx-1">
                <View className="flex items-center mb-1">
                  <Text className="text-32 font-bold truncate max-w-[4rem]">{pet.name}</Text>
                  <Text className={`ml-1 rcciconfont text-30 text-color-price ${pet.gender === PetGender.Female ? 'rccicon-female' : 'rccicon-male'}`}></Text>
                </View>
                <View className="text-28 text-gray-400">{pet.breed} {pet.age}</View>
              </View>
              <View>
                <Text className="rcciconfont rccicon-right text-24 text-gray-200" />
              </View>
            </View>
          )
        })}
        {!loading && petList.length === 0 ? <View className="noOrders flex flex-col items-center justify-center mt-8">
          <Image className="noOrdersImage" src={`${CDNIMGURL2}pet-empty.png`} />
          <View className="mt-2 flex justify-center">
            <Text className="ml-0.5  text-[#666] text-[30px]">啊哦,这里还没有宠物~</Text>
          </View>
        </View> : null}
        <View className="add-pet-btn">
          <View className="px-1 mt-1 mb-2 flex items-center">
            <View className="flex-1 mx-1 py-1 rounded-full bg-color-primary text-white text-30 flex items-center justify-center" onClick={addPet}>
              <Text className="rcciconfont rccicon-footprint text-32 mr-1"></Text>
              <Text className="text-32">添加宠物</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  )
}
export default PetList
