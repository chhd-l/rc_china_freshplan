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
  const { router } = getCurrentInstance()
  const [consumerInfo, setConsumerInfo] = useAtom(consumerAtom)
  const { system } = Taro.getSystemInfoSync()
  const systemType = system.indexOf('Android') > -1
  const [petInfoList, setPetInfoList] = useAtom(petInfoListAuto)

  console.log('system', system, systemType)
  let petNumber = router?.params?.petNumber || '1'

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
    setPetList([
      {
        age: '',
        birthday: '',
        breed: '',
        // consumerId: '20220415',
        gender: 'MALE',
        id: '-1',
        image: '',
        isSterilized: false,
        name: '',
        type: 'CAT',
      },
    ])
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
      <View className="pet-list  py-rc8" style={{ backgroundColor: '#eee', minHeight: '100vh' }}>
        {petList.map((pet, idx) => {
          return (
            <PetItem
              showAddPetBtn={true}
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
        <AtButton
          className="mx-4 mt-1"
          customStyle={{ fontSize: '.35rem' }}
          type="primary"
          onClick={addPet}
        >
          添加宠物
        </AtButton>
      </View>
    </>
  )
}
export default PetList
