import { Swiper, SwiperItem, View, Image, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { PetGender, PetListItemProps } from '@/framework/types/customer'
import Taro from '@tarojs/taro'
import { femaleIcon, maleIcon, petBg } from '@/lib/constants'
import { getPets } from '@/framework/api/pet/get-pets'
import { customerAtom } from '@/store/customer'
import { useAtom } from 'jotai'
import { getAge } from '@/utils/utils'
import { authLoginOpenedAtom } from '@/components/customer/AuthLogin'
import defaultCatImg from '@/assets/img/default.png'
import defaultDogImg from '@/assets/img/defaultdog.png'
import addIcon from '@/assets/img/add.png'

import './index.less'

const PetList = () => {
  const [petList, setPetList] = useState<PetListItemProps[]>([])
  const [customerInfo, setCustomerInfo] = useAtom(customerAtom)
  const [fakePet, setFakePet] = useState<any>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [, setAuthLoginOpened] = useAtom(authLoginOpenedAtom)

  const handleChange = (current: number) => {
    setCurrentIdx(current)
  }

  useEffect(() => {
    getList()
  }, [])

  Taro.useDidShow(() => {
    console.log(customerInfo, 'customerInfogetList')
    getList()
  })

  const getList = async () => {
    const customerInfos = Taro.getStorageSync('wxLoginRes').userInfo
    if (!customerInfos.id) {
      return
    }
    let res = (await getPets({ customerId: customerInfos.id })) || []
    res.forEach((item) => {
      item.age = getAge(item.birthday)
    })
    if (res.length > 1) {
      console.log('res', res)
      setCurrentIdx(1)
    } else {
      console.log('res2', res)
      setCurrentIdx(0)
    }
    setPetList(res)
    if (res.length === 2 || res.length === 3) {
      console.log('res3', res)
      setFakePet([...res, ...res])
    } else {
      console.log('res4', res)
      setFakePet(res)
    }
  }

  // const displayMultipleItems = () => {
  //   if(petList.length <= 1 || petList.length > 3) return petList.length
  //   if(petList.length === 2) {
  //     return 2
  //   } else {
  //     return 3
  //   }
  // }

  const toPetList = () => {
    if (!Taro.getStorageSync('wxLoginRes')) {
      setAuthLoginOpened(true)
      return
    }
    Taro.navigateTo({
      url: `/pages/packageB/petList/index?petNumber=${petList.length}`,
    })
  }

  return (
    <View className="py-2 px-4 rounded-lg  bg-contain  bg-gray-100 mt-4" style={{ backgroundImage: `url(${petBg})` }}>
      <View className="flex justify-between mb-1">
        <View className="font-semibold">我的宠物</View>
        <View
          className="w-4 h-4"
          onClick={toPetList}
          style="background:url(https://dtc-platform.oss-cn-shanghai.aliyuncs.com/static/pet_edit.png);background-size: contain;"
        ></View>
      </View>
      {fakePet.length ? (
        fakePet.length === 1 ? (
          <View>
            <View className="w-full flex mb-1">
              <View className="text-center h-full w-full flex items-center">
                <View className="m-auto w-16 h-16 flex items-center bg-white rounded-full shadow-md">
                  <Image
                    src={fakePet[0].type === 'DOG' ? defaultDogImg : defaultCatImg}
                    // src={pet.image}
                    className="w-10 h-10 m-auto"
                  />
                </View>
              </View>
              <View className="w-6 h-6 m-auto" onClick={toPetList}>
                <View
                  className="w-full h-full bg-no-repeat bg-contain"
                  style={{
                    backgroundImage: `url(https://dtc-platform.oss-cn-shanghai.aliyuncs.com/static/small_add.svg)`,
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    boxShadow: '-0.5px 0.5px 22px 0px #666',
                  }}
                />
              </View>
            </View>
            <View className="text-center flex justify-center items-center">
              <Text className="text-primary-red font-semibold text-lg mx-2">{fakePet[currentIdx]?.name}</Text>
              <View
                className="w-3 h-3 mr-4  bg-contain"
                style={{
                  backgroundImage: `url(${fakePet[currentIdx]?.gender === PetGender.Female ? femaleIcon : maleIcon})`,
                }}
              ></View>
              <Text className=" text-22 bg-white">
                {fakePet[currentIdx]?.breed}
                <Text className=" ml-1">{` ${fakePet[currentIdx]?.age}`}</Text>
              </Text>
            </View>
          </View>
        ) : (
          <View>
            <View className="w-full flex items-center">
              <Swiper
                style={{ height: '80px' }}
                className="w-full flex items-center"
                circular
                displayMultipleItems={fakePet.length > 1 ? 3 : fakePet.length}
                onChange={({ detail }) => {
                  let current = fakePet.length > 1 ? detail.current + 1 : detail.current
                  if (current >= fakePet.length) {
                    current = 0
                  }
                  console.log(' current', current)
                  handleChange(current)
                }}
              >
                {fakePet.map((pet, idx) => (
                  <SwiperItem key={idx}>
                    <View className="text-center h-full flex items-center">
                      {pet.id != '-1' ? (
                        <View
                          className={`w-16 h-16 bg-white h-full rounded-full shadow-md flex items-center justify-center  ${
                            currentIdx === idx ? '' : 'scale-75 transform '
                          }`}
                        >
                          <Image
                            src={pet.type === 'DOG' ? defaultDogImg : defaultCatImg}
                            // src={pet.image}
                            className="w-10 h-10 m-auto"
                          />
                        </View>
                      ) : null}
                    </View>
                  </SwiperItem>
                ))}
              </Swiper>
              <View className="w-6 h-6 m-auto" onClick={toPetList}>
                <View
                  className="w-full h-full bg-no-repeat bg-contain"
                  style={{
                    backgroundImage: `url(https://dtc-platform.oss-cn-shanghai.aliyuncs.com/static/small_add.svg)`,
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    boxShadow: '-0.5px 0.5px 22px 0px #666',
                  }}
                />
              </View>
            </View>
            <View className="text-center flex justify-center items-center">
              <Text className="text-primary-red font-semibold text-lg mx-2">{fakePet[currentIdx]?.name}</Text>
              <View
                className="w-3 h-3 mr-4  bg-contain"
                style={{
                  backgroundImage: `url(${fakePet[currentIdx]?.gender === PetGender.Female ? femaleIcon : maleIcon})`,
                }}
              ></View>
              <Text className=" text-22 bg-white">
                {fakePet[currentIdx]?.breed}
                <Text className=" ml-1">{` ${fakePet[currentIdx]?.age}`}</Text>
              </Text>
            </View>
          </View>
        )
      ) : (
        <View
          onClick={toPetList}
          className="w-16 h-16 m-auto bg-no-repeat bg-contain mb-3"
          style={{ backgroundImage: `url(https://dtc-platform.oss-cn-shanghai.aliyuncs.com/static/pet_add_2.png)` }}
        ></View>
      )}
    </View>
  )
}

export default PetList
