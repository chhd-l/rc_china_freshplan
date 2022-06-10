import NavBar from '@/components/common/Navbar'
import PetItem from '@/components/customer/PetItem'
import { getPets } from '@/framework/api/pet/get-pets'
import { PetListItemProps } from '@/framework/types/customer'
import { initNewPet } from '@/lib/customer'
import { customerAtom } from '@/store/customer'
import { petInfoListAuto } from '@/store/pets'
import { getAge } from '@/utils/utils'
import { View } from '@tarojs/components'
import { getCurrentInstance } from '@tarojs/taro'
import { useAtom } from 'jotai'
import cloneDeep from 'lodash.cloneDeep'
import { useEffect, useState } from 'react'
import { AtButton } from 'taro-ui'
import './index.less'

const PetList = () => {
  const [petList, setPetList] = useState<PetListItemProps[]>([])
  const [showAddPetBtn, SetshowAddPetBtn] = useState(true)
  const { router } = getCurrentInstance()
  const [customerInfo, setCustomerInfo] = useAtom(customerAtom)
  const [petInfoList, setPetInfoList] = useAtom(petInfoListAuto)

  let petNumber = router?.params?.petNumber || '0'

  const getList = async () => {
    let res = (await getPets({ customerId: customerInfo?.id })) || []
    console.log('resxxxxxxxxxxxxx', res)
    res.forEach((item) => {
      item.age = getAge(item.birthday)
    })
    setPetInfoList(res)
    if (res.length) {
      setPetList(res)
      SetshowAddPetBtn(true)
    } else {
      setPetList([
        {
          age: '',
          birthday: '',
          breed: '',
          customerId: '20220415',
          gender: 'MALE',
          id: '-1',
          image: '',
          isSterilized: false,
          name: '',
          type: 'CAT',
        },
      ])
      SetshowAddPetBtn(false)
    }
  }

  const addPet = () => {
    petList.push(initNewPet)
    SetshowAddPetBtn(false)
    setPetList(cloneDeep(petList))
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
      <NavBar navbarTitle="宠物管理" isNeedBack />
      <View className="pet-list  py-2" style={{ backgroundColor: '#eee', minHeight: '100vh' }}>
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
          <AtButton
            className="mx-3 mt-4 text-xs flex items-center justify-center py-3 h-10 add-pet-btn"
            onClick={addPet}
            circle
            type="secondary"
            size="small"
          >
            添加宠物
          </AtButton>
        ) : null}
      </View>
    </>
  )
}
export default PetList
