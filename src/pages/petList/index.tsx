import PetItem from '@/components/consumer/PetItem'
import { PetListItemProps } from '@/framework/types/consumer'
import { consumerAtom } from '@/store/consumer'
import { petInfoListAuto } from '@/store/pets'
import { getPets } from '@/framework/api/pet/get-pets'
import { getAge } from '@/utils/utils'
import { View } from '@tarojs/components'
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
    my.navigateTo({ url: '/pages/petEdit/index' })
  }

  useEffect(() => {
    getList()
  }, [])

  return (
    <>
      <View className="pet-list" style={{ backgroundColor: '#eee', minHeight: '100vh' }}>
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
          <AtButton className="mx-4 mt-1 mb-2 rounded-full" customStyle={{ fontSize: '.35rem' }} type="primary" onClick={addPet}>
            添加宠物
          </AtButton>
        </View>
      </View>
    </>
  )
}
export default PetList
