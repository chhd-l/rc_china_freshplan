import RotationChartList from '@/components/RotationChartList'
import { getSubscriptionDetail } from '@/framework/api/subscription/subscription'
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
    },
    productList: [{ variants: { name: '', defaultImage: '' }, description: '' }],
    id: '',
    no: '',
    createNextDeliveryTime: 0,
    consumer: { phone: '' },
    source: 'ALIPAY_MINI_PROGRAM',
  })
  const getSubscriptionDetails = async (id: string) => {
    let res = await getSubscriptionDetail(id)
    res.pet.age = getAge(res.pet.birthday)
    setSubscriptionDetails(res)
    console.log('res', res)
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

  useEffect(() => {
    const { router } = getCurrentInstance()
    const subscriptionId = router?.params?.id ?? ''
    getSubscriptionDetails(subscriptionId)
  }, [])

  return (
    <View className="freshPlanDetails p-1 pb-4">
      <View className="boxShadow">
        <RotationChartList newOpen={false} list={[subscriptionDetails.pet]} />
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
                <View className="font-bold text-[30px] text-[#96CC39]">{el?.variants?.name}</View>
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
        <View className="flex items-center text-[22px] my-1">
          <Image
            style={{
              width: '0.912rem',
              height: '0.76rem',
            }}
            src={`${CDNIMGURL}post.png`}
          />
          <Text className="ml-1.5">
            下一次将在{moment(subscriptionDetails.createNextDeliveryTime).format('YYYY-MM-DD')}发货，请注意查收!
          </Text>
        </View>
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
            计划进度
          </AtButton>
        </View>
      </View>
      <View className="bg-white boxShadow p-1 mt-1">
        <View className="text-[34px]">发货驿站</View>
        <View className="w-[30px] h-[4px] bg-[#96CC39] mt-1" />
        <View className="flex items-center mt-1 ml-0.5">
          <Image
            style={{
              width: '0.5022rem',
              height: '0.3807rem',
            }}
            src={`${CDNIMGURL}plateform.png`}
          />
          <Text className="ml-1">签约平台：{returnTypeText()}</Text>
        </View>
        <View className="flex items-center mt-1 ml-0.5">
          <Image
            style={{
              width: '0.5022rem',
              height: '0.3807rem',
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
