import CommonTitle from '@/components/creatSubscription/CommonTitle'
import AuthLogin, { authLoginOpenedAtom } from '@/components/consumer/AuthLogin'
import { getPets } from '@/framework/api/pet/get-pets'
import { PetGender, PetListItemProps } from '@/framework/types/consumer'
import IconFont from '@/iconfont'
import { Cat, Dog, femaleIcon, maleIcon, petBg } from '@/lib/constants'
import { consumerAtom } from '@/store/consumer'
import { petInfoListAuto } from '@/store/pets'
import { recommendInfoAtom } from '@/store/subscription'
import { getAge } from '@/utils/utils'
import { Image, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { FrePetUnchoose, FreshPetChoose } from '@/lib/subscription'
import { AtIcon } from 'taro-ui'
import './index.less'

interface Props {
  showCheckBox?: boolean
  handleCheckedPet?: Function
  siglePetInfo?: any
  withoutLoading?: boolean
}
const PetList = (props: Props) => {
  const [petList, setPetList] = useState<PetListItemProps[]>([])
  const [fakePet, setFakePet] = useState<any>([])
  const [Nopets, setNopets] = useState(Taro.getStorageSync('Nopets') ? Taro.getStorageSync('Nopets') : true)
  const [, setAuthLoginOpened] = useAtom(authLoginOpenedAtom)
  const [recommendInfo, setRecommendInfo] = useAtom(recommendInfoAtom)
  const [petInfoList, setPetInfoList] = useAtom(petInfoListAuto)
  const { currentIdx, checkedArr } = recommendInfo
  const [consumerInfo, setConsumerInfo] = useAtom(consumerAtom)

  const { system } = Taro.getSystemInfoSync()
  const systemType = system.indexOf('Android') > -1
  const handleChange = (current: number) => {
    setRecommendInfo({ ...recommendInfo, currentIdx: current })
  }
  useEffect(() => {
    getList()
  }, [consumerInfo?.id])

  Taro.useDidShow(() => {
    getList()
  })

  const getList = async () => {
    if (props.withoutLoading) {
      Taro.setStorageSync('commerce-loading', 1)
    }
    // const consumerInfo = await Taro.getStorageSync('wxLoginRes').userInfo
    if (!consumerInfo?.id) {
      //未登录需要清空宠物信息
      setPetList([])
      setFakePet([])
      return
    }
    if (props.siglePetInfo) {
      let petArr: any = [props.siglePetInfo]
      petArr[0].age = getAge(petArr[0].birthday)
      petArr[0].breed = petArr[0].breedName
      setPetList(petArr)
      setFakePet(petArr)
      setNopets(false)
      return
    }
    if (petInfoList?.length) {
      setPetList(petInfoList)
      setFakePet(petInfoList)
      setNopets(false)
      Taro.setStorageSync('Nopets', false)
      return
    } else {
      Taro.setStorageSync('Nopets', true)
    }
    let res = (await getPets({ consumerId: consumerInfo.id })) || []
    res.forEach((item) => {
      item.age = getAge(item.birthday)
    })
    // if (props.siglePetInfo) {
    //   res = res.filter((el) => el.petId === props.siglePetInfo?.id)
    //   if (!res.length) {
    //     // debugger
    //     res = [props.siglePetInfo]
    //     res.age = getAge(res.birthday)
    //   }
    // }
    // if (res.length > 1) {
    //   setRecommendInfo({ ...recommendInfo, currentIdx: 1, checkedArr: [] })
    // } else {
    //   setRecommendInfo({ ...recommendInfo, currentIdx: 0, checkedArr: [] })
    // }
    if (res.length) {
      setNopets(false)
      Taro.setStorageSync('Nopets', false)
    } else {
      Taro.setStorageSync('Nopets', true)
    }
    setPetInfoList(res)
    setPetList(res)
    setFakePet(res)
  }
  const handleChecked = (value, index) => {
    let pet = petList.find((el) => el.id === value)
    props.handleCheckedPet?.(pet)
    setRecommendInfo({ ...recommendInfo, recommPetInfo: pet, checkedArr: [value], currentIdx: index })
  }

  const toPetList = () => {
    // if (!Taro.getStorageSync('wxLoginRes')) {
    //   setAuthLoginOpened(true)
    //   return
    // }
    // Taro.navigateTo({
    //   url: `/pages/packageB/petList/index?petNumber=${petList.length}`,
    // })
    
    my.navigateTo({ url: `/pages/packageB/petList/index?petNumber=${petList.length}` })
  }
  const CheckBoxItem = ({ id, idx }: { id: string; idx?: number }) => {
    return props.showCheckBox ? (
      <View
        className="absolute bottom-0 right-0 w-4 h-4"
        // className={` check-icon  flex justify-center items-center rounded-sm `}
        onClick={() => {
          handleChecked(id, idx)
        }}
      >
        <Image src={checkedArr.includes(id) ? FreshPetChoose : FrePetUnchoose} className="w-4 h-4" />
      </View>
    ) : null
  }
  const renderNoPet = () => {
    return (
      <View
        onClick={toPetList}
        style={{
          borderRadius: '50%',
          backgroundImage: `url(https://dtc-platform.oss-cn-shanghai.aliyuncs.com/static/Pet_Add.png)`,
        }}
        className="w-22 h-22 bg-no-repeat  bg-contain flex justify-center items-center Petpictureshadow text-gray-300 mt-2 relative"

        // src={pet.image}
      >
        {/* <AtIcon value="add" size={16} /> */}
      </View>
    )
  }
  const renderOnePet = () => {
    return (
      <View className="box-border">
        <View className="w-full flex relative mb-2">
          <View className="text-center h-full w-full flex items-center">
            <View
              className={`m-auto box-border w-22 h-22 flex items-center ${
                fakePet[0].image ? 'bg-white  image-pad shadow-little' : ''
              } rounded-full relative`}
              onClick={() => {
                handleChecked(fakePet[0].id, 0)
              }}
            >
              <Image
                src={fakePet[0].image || (fakePet[0].type === 'DOG' ? Dog : Cat)}
                // src={pet.image}
                style={{ borderRadius: '50%' }}
                className="w-full h-full m-auto Petpictureshadow"
              />
              <CheckBoxItem id={fakePet[0].id} idx={0} />
            </View>
          </View>
          <View
            style={{ top: '50%', transform: 'translateY(-50%)' }}
            className="w-6 h-6 m-auto absolute right-0"
            onClick={toPetList}
          >
            <View
              className="w-full h-full bg-no-repeat bg-contain"
              style={{
                backgroundImage: `url(https://dtc-platform.oss-cn-shanghai.aliyuncs.com/static/small_add.svg)`,
                backgroundColor: '#fff',
                borderRadius: '50%',
                boxShadow: '-0.5px 0.5px 10px 0px #999',
              }}
            />
          </View>
        </View>
        <View className="text-center flex justify-center items-center">
          <Text className="text-primary-red font-semibold text-lg mx-2">{fakePet[0]?.name}</Text>
          <View
            className="w-3 h-3 mr-4  bg-contain"
            style={{
              backgroundImage: `url(${fakePet[0]?.gender === PetGender.Female ? femaleIcon : maleIcon})`,
            }}
          ></View>
          <Text className=" text-22 bg-white">
            {fakePet[0]?.breed}
            <Text className=" ml-1">{fakePet[0]?.age ? ` ${fakePet[0]?.age}` : ''}</Text>
          </Text>
        </View>
      </View>
    )
  }
  const renderTwoPet = () => {
    return (
      <View className="box-border">
        <View className="w-full flex items-center mb-2">
          <Swiper
            style={{ minHeight: '5rem' }}
            className="w-72 flex items-center h-22"
            circular
            nextMargin={systemType ? '180rpx' : '100rpx'}
            previousMargin={systemType ? '160rpx' : '200rpx'}
            current={currentIdx}
            onChange={({ detail }) => handleChange(detail.current)}
          >
            {fakePet.map((pet, idx: number) => {
              return (
                <SwiperItem key={idx}>
                  <View className="text-center h-full flex items-center justify-center">
                    <View
                      className={`box-border ${
                        pet.image ? 'bg-white  image-pad shadow-little' : ''
                      }   w-22 h-22 rounded-full flex items-center justify-center relative 
                    ${currentIdx !== idx && 'scale-75 transform'}`}
                      onClick={() => {
                        handleChecked(pet.id, idx)
                      }}
                    >
                      <Image
                        src={pet.image || (pet.type === 'DOG' ? Dog : Cat)}
                        style={{ borderRadius: '50%' }}
                        // src={pet.image}
                        className="w-full h-full m-auto Petpictureshadow"
                      />
                      <CheckBoxItem id={pet.id} idx={idx} />
                      <View className="hidden">
                        idx:{idx}
                        currentIdx:{currentIdx}
                      </View>
                    </View>
                  </View>
                </SwiperItem>
              )
            })}
          </Swiper>
          <View className="w-6 h-6 m-auto" onClick={toPetList}>
            <View
              className=" bg-no-repeat bg-contain w-6 h-6 "
              style={{
                backgroundImage: `url(https://dtc-platform.oss-cn-shanghai.aliyuncs.com/static/small_add.svg)`,
                backgroundColor: '#fff',
                borderRadius: '50%',
                boxShadow: '0px 0 8px 2px #eaeaea',
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
  }

  const renderGreaterThanOrEqualThreePet = () => {
    return (
      <View className="box-border">
        <View className="w-full flex items-center mb-2">
          <Swiper
            style={{ minHeight: '5rem' }}
            className="w-full flex items-center h-22"
            circular
            // displayMultipleItems={fakePet.length > 1 ? 3 : fakePet.length}
            nextMargin="200rpx"
            previousMargin="200rpx"
            current={currentIdx}
            onChange={({ detail }) => handleChange(detail.current)}
          >
            {fakePet.map((pet, idx: number) => {
              return (
                <SwiperItem key={idx}>
                  <View className="text-center h-full flex items-center justify-center">
                    {pet.id != '-1' ? (
                      <View
                        className={`box-border ${
                          pet.image ? 'bg-white   image-pad shadow-little' : ''
                        } w-22  h-22 rounded-full flex items-center justify-center relative 
                  ${currentIdx !== idx && 'scale-75 transform'} `}
                        onClick={() => {
                          handleChecked(pet.id, idx)
                        }}
                      >
                        <Image
                          src={pet.image || (pet.type === 'DOG' ? Dog : Cat)}
                          style={{ borderRadius: '50%' }}
                          // src={pet.image}
                          className="w-full h-full m-auto Petpictureshadow"
                        />
                        <CheckBoxItem id={pet.id} idx={idx} />
                        <View className="hidden">
                          idx:{idx}
                          currentIdx:{currentIdx}
                        </View>
                      </View>
                    ) : null}
                  </View>
                </SwiperItem>
              )
            })}
          </Swiper>
          <View className="w-6 h-6 m-auto" onClick={toPetList}>
            <View
              className="bg-no-repeat bg-contain w-6 h-6 "
              style={{
                backgroundImage: `url(https://dtc-platform.oss-cn-shanghai.aliyuncs.com/static/small_add.svg)`,
                backgroundColor: '#fff',
                borderRadius: '50%',
                boxShadow: '0px 0 8px 2px #eaeaea',
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
  }
  const renderPetContent = () => {
    if (!fakePet.length) return renderNoPet()
    if (fakePet.length === 1) return renderOnePet()
    if (fakePet.length === 2) return renderTwoPet()
    return renderGreaterThanOrEqualThreePet()
  }

  return (
    <View
      className={`${!fakePet.length ? '' : 'pb-4'}box-border px-4 rounded-lg  bg-contain  bg-gray-100 mt-4 PetListMy`}
      style={{
        backgroundImage: `url(${petBg})`,
      }}
    >
      <View className="flex justify-between mb-5 items-end pet-list-title">
        <CommonTitle title="我的宠物"></CommonTitle>
        <View className="w-4 h-4 bgacIImg" onClick={toPetList}></View>
      </View>
      {renderPetContent()}
      {Nopets && (
        <View className="custompettips relative flex flex-col items-center top-0">
          <View className="triangle" />
          <View
            className="w-full h-9 flex items-center justify-center text-xs text-white"
            style={{ borderRadius: '1.5rem', backgroundColor: '#BEBEBE' }}
          >
            赶紧添加你的宠物信息，定制TA的营养套餐哦~
          </View>
          <View
            className="absolute top-2 right-0 border-2 border-solid"
            style={{ borderRadius: '100%', backgroundColor: '#BEBEBE', borderColor: '#BEBEBE' }}
            onClick={() => {
              setNopets(false)
              Taro.setStorageSync('Nopets', false)
            }}
          >
            <IconFont name="shanchu" size={42} color="#fff" />
          </View>
        </View>
      )}
      <AuthLogin />
    </View>
  )
}

export default PetList
