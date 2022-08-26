import PetItem from '@/components/consumer/PetItem'
import { PetListItemProps, PetGender } from '@/framework/types/consumer'
import { consumerAtom } from '@/store/consumer'
import { petInfoListAuto } from '@/store/pets'
import { getPets } from '@/framework/api/pet/get-pets'
import { getAge } from '@/utils/utils'
import { View, Text, Image } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { CDNIMGURL } from '@/lib/constants'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { AtIcon } from 'taro-ui'
import './index.less'

const PetList = () => {
  const [petList, setPetList] = useState<PetListItemProps[]>([])
  const { router } = getCurrentInstance()
  const [consumerInfo, setConsumerInfo] = useAtom(consumerAtom)
  const { system } = Taro.getSystemInfoSync()
  const systemType = system.indexOf('Android') > -1
  const [petInfoList, setPetInfoList] = useAtom(petInfoListAuto)

  console.log('system', system, systemType)

  const getList = async () => {
    let res = (await getPets({ consumerId: consumerInfo?.id })) || []
    console.log('resxxxxxxxxxxxxx', res)
    res.forEach((item) => {
      item.age = getAge(item.birthday)
    })
    setPetInfoList(res)
    setPetList(res)
  }

  const addPet = () => {
    // petList.push(initNewPet)
    // SetshowAddPetBtn(false)
    // setPetList(cloneDeep(petList))
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
            <View key={idx} className="m-1 flex bg-white rounded-sm p-1 items-center" onClick={() => petDetail(pet)}>
              <View className="pet-image rounded-full overflow-hidden">
                <Image src={pet.image} mode="widthFix" />
              </View>
              <View className="flex-1 mx-1">
                <View className="flex items-center mb-1">
                  <Text className="text-32 font-bold">{pet.name}</Text>
                  <Text className={`ml-1 rcciconfont text-30 ${pet.gender === PetGender.Female ? 'text-color-primary rccicon-female' : 'text-gray-400 rccicon-male'}`}></Text>
                </View>
                <View className="text-28 text-gray-400">{pet.breed} {pet.age}</View>
              </View>
              <View>
                <AtIcon size="24" value="chevron-right" className="text-gray-200" />
              </View>
            </View>
          )
        })}
        {petList.length === 0 ? <View className="noOrders flex flex-col items-center justify-center pt-8">
          <Image className="noOrdersImage" src={`${CDNIMGURL}Empty%20orders.png`} />
          <View className="mt-2 flex justify-center">
            <Text className="ml-0.5">汪汪~啥也没有!</Text>
          </View>
        </View> : null}
        <View className="add-pet-btn">
          <View className="px-1 mt-1 mb-2 flex items-center">
            <View className="flex-1 mx-1 py-0.8 rounded-full bg-color-primary text-white text-30 flex items-center justify-center" onClick={addPet}>
              <Text className="rcciconfont rccicon-footprint text-32 mr-1"></Text>
              <Text className="text-28">添加宠物</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  )
}
export default PetList
