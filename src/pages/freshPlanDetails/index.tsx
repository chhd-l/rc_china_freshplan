import { getPet } from '@/framework/api/pet/get-pets'
import { getSubscriptionDetail } from '@/framework/api/subscription/subscription'
import { PetGender } from '@/framework/types/consumer'
import { CDNIMGURL } from '@/lib/constants'
import { getAge } from '@/utils/utils'
import { Image, Text, View } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { AtButton } from 'taro-ui'
import './index.less'

const FreshPlanDetails = () => {
  const [subscriptionDetails, setSubscriptionDetails] = useState({
    pet: {
      age: '',
      name: '',
      id: '',
      birthday: '',
      image: '',
      gender: '',
      type: '',
      breed: '',
    },
    productList: [{ name: '', variants: { name: '', defaultImage: '' }, description: '' }],
    id: '',
    no: '',
    status: '',
    createNextDeliveryTime: 0,
    consumer: { phone: '' },
    source: 'ALIPAY_MINI_PROGRAM',
  })
  const getSubscriptionDetails = async (id: string) => {
    let res = await getSubscriptionDetail(id)
    const pet = (await getPet(res.pet.id)) || []
    res.pet = pet
    res.pet.age = getAge(res.pet.birthday)
    setSubscriptionDetails(res)
  }

  const returnTypeText = () => {
    switch (subscriptionDetails?.source) {
      case 'WECHAT_MINI_PROGRAM':
        return '微信'
      case 'ALIPAY_MINI_PROGRAM':
        return '支付宝'
      default:
        return '微信'
    }
  }

  Taro.useDidShow(() => {
    const { router } = getCurrentInstance()
    const subscriptionId = router?.params?.id ?? ''
    getSubscriptionDetails(subscriptionId)
  })

  useEffect(() => {
    my.setNavigationBar({
      backgroundColor: '#c3ec7b',
    })
  }, [])

  const handlePetDetail = (pet: any) => {
    Taro.navigateTo({
      url: '/pages/packageA/petDetail/index',
      success: (res) => {
        res.eventChannel.emit('petFromList', pet)
      },
    })
  }

  return (
    <View className="freshPlanDetails p-1 pb-4">
      <View className="boxShadow bg-white p-1">
        <View
          className="text-[30px] font-bold pb-1 mb-1 flex items-cneter"
          style={{
            borderBottom: '1px solid #eee',
          }}
        >
          <Text className="rcciconfont rccicon-chongwu2 text-34 mr-0.5 text-[#ffb038]" />
          我的宠物
        </View>
        <View
          className="flex items-center justify-between my-[13px]"
          onClick={() => {
            subscriptionDetails.status !== 'VOID' && handlePetDetail(subscriptionDetails?.pet)
          }}
        >
          <View className="h-[116px] flex items-cneter">
            <View
              className="mr-1 flex-shrink-0 rounded-full overflow-hidden bg-[#FFB038]"
              style={{ width: '1.16rem', height: '1.16rem' }}
            >
              <Image src={subscriptionDetails?.pet?.image} mode="widthFix" />
            </View>
            <View className="flex flex-col justify-center">
              <View className="text-[30px] flex items-center">
                <Text className="truncate max-w-[4rem]">{subscriptionDetails?.pet?.name}</Text>
                <Text
                  className={`mx-0.5 rcciconfont text-[#D49D28] ${
                    subscriptionDetails?.pet?.gender === PetGender.Male ? 'rccicon-male' : 'rccicon-female'
                  }`}
                  style={{
                    fontSize: '0.18rem',
                  }}
                />
              </View>
              <Text className="text-[24px] text-[#999] mt-[16px]">
                {subscriptionDetails?.pet?.breed} {subscriptionDetails?.pet?.age}
              </Text>
            </View>
          </View>
          {subscriptionDetails.status !== 'VOID' && (
            <Text className="rcciconfont rccicon-right text-22 text-[#9D9D9D]" />
          )}
        </View>
      </View>
      <View className="bg-white mt-1 pb-1 px-1 boxShadow">
        <View
          className="py-1"
          style={{
            borderBottom: '1px solid #eee',
          }}
        >
          <View className="flex justify-between items-end">
            <Text className="text-[30px] font-bold">
              <Text className="rcciconfont rccicon-jihua text-34 mr-0.5 text-[#0f8ee9]" />
              计划商品
            </Text>
            <Text className="text-[24px] text-[#666]">计划编号:{subscriptionDetails.no}</Text>
          </View>
        </View>
        <View className="flex flex flex-col">
          {subscriptionDetails.productList.map((el, key) => (
            <View className="mt-1 flex item-center text-[24px] h-[190px]" key={key}>
              <Image
                className="mr-1 h-full rounded-[10px] bg-[#f1f1f1]"
                src={el?.variants?.defaultImage}
                style={{ width: '1.9rem' }}
              />
              <View className="h-full flex flex-col justify-center flex-1">
                <View className="font-bold text-[28px] text-[#000]">{el?.name}</View>
                <View className="flex items-center justify-between mt-1.5 text-[#666]">
                  {(el?.description ?? '').replace(/<[^>]+>/gi, '')}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View className="bg-white boxShadow px-1 pt-1 pb-2 mt-1">
        <View
          className="text-[30px] font-bold pb-1"
          style={{
            borderBottom: '1px solid #eee',
          }}
        >
          <Text className="rcciconfont rccicon-fahuoyizhan text-34 mr-0.5 text-[#0f8ee9]" />
          发货驿站
        </View>
        {subscriptionDetails.status !== 'VOID' ? (
          <View className="flex items-center my-1">
            <Image
              style={{
                width: '1.1rem',
                height: '1.1rem',
                backgroundSize: '103% 100%',
              }}
              src={`${CDNIMGURL}next-ship.png`}
            />
            <Text className="ml-1.5 text-[28px] leading-[33px]">
              下一次将在{moment(subscriptionDetails.createNextDeliveryTime).format('YYYY-MM-DD')}发货，请注意查收!
            </Text>
          </View>
        ) : (
          <View className="flex my-1">
            <Image
              style={{
                width: '1.1rem',
                height: '1.1rem',
              }}
              src={`${CDNIMGURL}ship-cancel.png`}
            />
            <Text className="ml-1.5 mt-1 text-[28px] leading-[33px]">本次计划已取消</Text>
          </View>
        )}
        {subscriptionDetails.status !== 'VOID' && (
          <View className="flex justify-end">
            <AtButton
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/schedule/index?id=${subscriptionDetails?.id}`,
                })
              }}
              circle
              className="w-[228px] h-[72px] leading-[72px] text-[30px] m-0 flex items-center justify-center"
              type="primary"
            >
              计划进度
            </AtButton>
          </View>
        )}
      </View>
      <View className="bg-white boxShadow p-1 mt-1">
        <View
          className="text-[30px] pb-1 font-bold"
          style={{
            borderBottom: '1px solid #eee',
          }}
        >
          <Text className="rcciconfont rccicon-a-11 text-34 mr-0.5 text-[#ffb038]" />
          签约信息
        </View>
        <View className="flex text-[28px] items-center mt-1">
          <Text className="rcciconfont rccicon-pingtai text-34 mr-0.5 text-[#96CC39]" />
          <Text>签约平台：{returnTypeText()}</Text>
        </View>
        <View className="flex text-[28px] items-center mt-1">
          <Text className="rcciconfont rccicon-zhanghao text-34 mr-0.5 text-[#96CC39]" />
          <Text>签约账户：{subscriptionDetails.consumer.phone}</Text>
        </View>
      </View>
    </View>
  )
}

export default FreshPlanDetails
