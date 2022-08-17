import PetItem from '@/components/consumer/PetItem'
import { PetListItemProps } from '@/framework/types/consumer'
import { consumerAtom } from '@/store/consumer'
import { petInfoListAuto } from '@/store/pets'
import { getPets } from '@/framework/api/pet/get-pets'
import { getAge } from '@/utils/utils'
import { View, Text } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { AtButton } from 'taro-ui'
import './index.less'

const PetList = () => {
  const [petList, setPetList] = useState<PetListItemProps[]>([])
  const { router } = getCurrentInstance()
  const [consumerInfo, setConsumerInfo] = useAtom(consumerAtom)
  const { system } = Taro.getSystemInfoSync()
  const systemType = system.indexOf('Android') > -1
  const [petInfoList, setPetInfoList] = useAtom(petInfoListAuto)

  console.log('system', system, systemType)
  let petNumber = router?.params?.petNumber || '1'

  const getList = async () => {
    let res = (await getPets({ consumerId: consumerInfo?.id })) || []
    console.log('resxxxxxxxxxxxxx', res)
    res.forEach((item) => {
      item.age = getAge(item.birthday)
    })
    setPetInfoList(res)
    if (res.length) {
      setPetList(res)
    }
  }

  const addPet = () => {
    // petList.push(initNewPet)
    // SetshowAddPetBtn(false)
    // setPetList(cloneDeep(petList))
    Taro.navigateTo({ url: '/pages/petEdit/index' })
  }

  Taro.useDidShow(() => {
    getList()
  });

  return (
    <>
      <View className="pet-list pb-12" style={{ backgroundColor: '#eee', minHeight: '100vh' }}>
        {petList.map((pet, idx) => {
          return (
            <PetItem
              showAddPetBtn
              key={pet.id}
              SetshowAddPetBtn={() => {}}
              getList={getList}
              pet={pet}
              petIdx={idx}
              petList={petList}
              setPetList={setPetList}
            />
          )
        })}
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
