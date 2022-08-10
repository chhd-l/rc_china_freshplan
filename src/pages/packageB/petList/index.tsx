import NavBar from '@/components/common/Navbar'
import PetItem from '@/components/consumer/PetItem'
import { getPets } from '@/framework/api/pet/get-pets'
import { PetListItemProps } from '@/framework/types/consumer'
import { initNewPet } from '@/lib/consumer'
import { consumerAtom } from '@/store/consumer'
import { petInfoListAuto } from '@/store/pets'
import { getAge } from '@/utils/utils'
import { View } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { useAtom } from 'jotai'
import cloneDeep from 'lodash.cloneDeep'
import { useEffect, useState } from 'react'
import { AtButton } from 'taro-ui'
import IconFont from '@/iconfont';
import './index.less'

const PetList = () => {
  const [petList, setPetList] = useState<PetListItemProps[]>([])
  const [showAddPetBtn, SetshowAddPetBtn] = useState(true)
  const { router } = getCurrentInstance()
  const [consumerInfo, setConsumerInfo] = useAtom(consumerAtom)
  const { system } = Taro.getSystemInfoSync()
  const systemType = system.indexOf('Android') > -1
  const [petInfoList, setPetInfoList] = useAtom(petInfoListAuto)

  console.log('system', system, systemType)
  let petNumber = router?.params?.petNumber || '0'

  const getList = async () => {
    // let res = (await getPets({ consumerId: consumerInfo?.id })) || []
    // console.log('resxxxxxxxxxxxxx', res)
    // res.forEach((item) => {
    //   item.age = getAge(item.birthday)
    // })
    // setPetInfoList(res)
    // if (res.length) {
    //   setPetList(res)
    //   SetshowAddPetBtn(true)
    // } else {
    //   setPetList([
    //     {
    //       age: '',
    //       birthday: '',
    //       breed: '',
    //       // consumerId: '20220415',
    //       gender: 'MALE',
    //       id: '-1',
    //       image: '',
    //       isSterilized: false,
    //       name: '',
    //       type: 'CAT',
    //     },
    //   ])
    //   SetshowAddPetBtn(false)
    // }
  }

  const addPet = () => {
    // petList.push(initNewPet)
    // SetshowAddPetBtn(false)
    // setPetList(cloneDeep(petList))
    my.navigateTo({ url: '/pages/packageB/petEdit/index' })
  }

  useEffect(() => {
    if (Number(petNumber) > 0) {
      getList()
    } else {
      addPet()
    }
  }, [])

  return (
    <>
      <View className="pet-list  py-rc8" style={{ backgroundColor: '#eee', minHeight: '100vh' }}>
        {petList.map((pet, idx) => {
          return (
            <PetItem
              showAddPetBtn={showAddPetBtn}
              key={pet.id}
              SetshowAddPetBtn={SetshowAddPetBtn}
              getList={getList}
              pet={pet}
              petIdx={idx}
              petList={petList}
              setPetList={setPetList}
            />
          )
        })}
        {showAddPetBtn ? (
          systemType ? (
            <AtButton
              className="mx-4 mt-1 flex items-center justify-center h-4 text-rc30"
              onClick={addPet}
              type="primary"
            >
              添加宠物
            </AtButton>
          ) : (
            <AtButton
              className="mx-4 mt-1 flex items-center h-4 justify-center"
              customStyle={{ fontSize: '.35rem' }}
              onClick={addPet}
              type="primary"
            >
              添加宠物
            </AtButton>
          )
        ) : null}
      </View>
    </>
  )
}
export default PetList
