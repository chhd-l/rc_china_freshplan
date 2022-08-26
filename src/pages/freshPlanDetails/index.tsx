import { getPets } from '@/framework/api/pet/get-pets'
import { getSubscriptionDetail } from '@/framework/api/subscription/subscription'
import { CDNIMGURL, CDNIMGURL2 } from '@/lib/constants'
import { getAge } from '@/utils/utils'
import { Image, Text, View } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import moment from 'moment'
import { useState } from 'react'
import { AtButton, AtIcon } from 'taro-ui'
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
    const _storeRes: any = Taro.getStorageSync('wxLoginRes')
    const pets = (await getPets({ consumerId: _storeRes?.userInfo?.id })) || []
    res.pet = pets.filter((item) => item.id === res.pet.id)[0]
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

  const returnPetdefaultImage = () => {
    if (subscriptionDetails?.pet?.image) return subscriptionDetails.pet.image
    else if (subscriptionDetails?.pet?.type === 'CAT') return 'cat-default.png'
    else return 'dog-default.png'
  }

  return (
    <View className="freshPlanDetails p-1 pb-4">
      <View className="boxShadow bg-white p-1">
        <View
          className="text-[30px] font-bold pb-1 mb-1 flex items-cneter"
          style={{
            borderBottom: '1px solid #E2E2E2',
          }}
        >
          <Image
            className="mr-0.5 h-full rounded-full"
            src={`${CDNIMGURL2}pet-foot.png`}
            style={{ width: '0.33rem', height: '0.33rem' }}
          />
          我的宠物
        </View>
        <View className="flex items-center justify-between">
          <View className="h-[116px] flex items-cneter">
            <Image
              className="mr-1 h-full rounded-full bg-[#FFB038]"
              src={`${returnPetdefaultImage()}`}
              style={{ width: '1.16rem' }}
            />
            <View className="flex flex-col justify-center">
              <Text className="text-[30px] flex items-center">
                球球{' '}
                <Text
                  className={`mx-0.5 rcciconfont text-[#D49D28] ${
                    subscriptionDetails?.pet?.gender === 'MALE' ? 'rccicon-male' : 'rccicon-female'
                  }`}
                  style={{
                    fontSize: '0.18rem',
                  }}
                />
              </Text>
              <Text className="text-[24px] text-[#999] mt-[16px]">英国短毛猫 1岁1个月</Text>
            </View>
          </View>
          <AtIcon
            onClick={() => {
              Taro.navigateTo({ url: '/pages/packageA/petList/index' })
            }}
            className="font-thin -mr-[5px]"
            value="chevron-right"
            color="#999"
            size="22"
          />
        </View>
      </View>
      <View className="bg-white mt-1 pb-1 px-1 boxShadow">
        <View
          className="py-1"
          style={{
            borderBottom: '1px solid #E2E2E2',
          }}
        >
          <View className="flex justify-between items-end">
            <Text className="text-[34px]">订单信息</Text>
            <Text className="text-[24px] text-[#666]">Fresh编号:{subscriptionDetails.no}</Text>
          </View>
          <View className="w-[30px] h-[4px] bg-[#96CC39] mt-1" />
        </View>
        <View className="flex flex flex-col">
          {subscriptionDetails.productList.map((el, key) => (
            <View className="mt-1 flex item-center text-[20px] h-[190px]" key={key}>
              <Image className="mx-1 h-full" src={el?.variants?.defaultImage} style={{ width: '1.9rem' }} />
              <View className="h-full flex flex-col justify-center flex-1">
                <View className="font-bold text-[30px] text-[#96CC39]">{el?.name}</View>
                <View className="flex items-center justify-between mt-1.5 text-[#666]">
                  {(el?.description ?? '').replace(/<[^>]+>/gi, '')}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View className="bg-white boxShadow px-1 pt-1 pb-2 mt-1">
        <View className="text-[34px]">发货驿站</View>
        <View className="w-[30px] h-[4px] bg-[#96CC39] mt-1" />
        {subscriptionDetails.status !== 'VOID' ? (
          <View className="flex items-center my-1">
            <Image
              style={{
                width: '1.1rem',
                height: '0.86rem',
                backgroundSize: '103% 110%',
              }}
              src={`${CDNIMGURL}post.png`}
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
              src={`${CDNIMGURL2}cancel-icon.png`}
            />
            <Text className="ml-1.5 mt-1 text-[28px] leading-[33px]">本次Fresh plan已取消</Text>
          </View>
        )}
        <View className="flex justify-end">
          <AtButton
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/schedule/index?id=${subscriptionDetails?.id}`,
              })
            }}
            circle
            className="w-[228px] h-[64px] leading-[64px] text-[26px] m-0"
            type="primary"
          >
            {subscriptionDetails.status !== 'VOID' ? '计划进度' : '查看计划详情'}
          </AtButton>
        </View>
      </View>
      <View className="bg-white boxShadow p-1 mt-1">
        <View className="text-[34px]">签约信息</View>
        <View className="w-[30px] h-[4px] bg-[#96CC39] mt-1" />
        <View className="flex text-[28px] items-center mt-1 ml-0.5">
          <Image
            style={{
              width: '0.5022rem',
              height: '0.407rem',
            }}
            src={`${CDNIMGURL}plateform.png`}
          />
          <Text className="ml-1">签约平台：{returnTypeText()}</Text>
        </View>
        <View className="flex text-[28px] items-center mt-1 ml-0.5">
          <Image
            style={{
              width: '0.5022rem',
              height: '0.4407rem',
            }}
            src={`${CDNIMGURL}account-sig.png`}
          />
          <Text className="ml-1">签约账户：{subscriptionDetails.consumer.phone}</Text>
        </View>
      </View>
    </View>
  )
}

export default FreshPlanDetails
