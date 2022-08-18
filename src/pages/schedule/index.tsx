import { getSubscriptionDetail } from '@/framework/api/subscription/subscription'
import { CDNIMGURL } from '@/lib/constants'
import { formatMoney } from '@/utils/utils'
import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { AtButton, AtIcon, AtList, AtListItem } from 'taro-ui'

const Schedule = () => {
  const [PopupOpne, setPopupOpne] = useState(false)
  const [subscriptionDetails, setSubscriptionDetails] = useState({
    productList: [{ variants: { name: '', defaultImage: '', num: 0, subscriptionPrice: 0 } }],
    no: '',
    createNextDeliveryTime: 0,
    consumer: { phone: '' },
    address: {
      city: '',
      region: '',
      detail: '',
    },
    price: {
      deliveryPrice: 0,
      discountsPrice: 0,
      productPrice: 0,
      totalPrice: 0,
    },
  })
  const getSubscriptionDetails = async () => {
    let res = await getSubscriptionDetail('a7390fc6-3d30-0e54-6db4-4ab822c2564a')
    console.log('res', res)
    setSubscriptionDetails(res)
  }

  useEffect(() => {
    getSubscriptionDetails()
  }, [])

  return (
    <View className="p-1 pb-4 Schedule">
      <View className="bg-white mt-1 pb-1 px-1 boxShadow">
        <View className="py-1">
          <View className="flex justify-between items-end">
            <Text className="text-[34px]">下次发货</Text>
            <Text className="text-[22px] text-[#666]">Fresh编号:{subscriptionDetails.no}</Text>
          </View>
          <View className="w-[30px] h-[4px] bg-[#96CC39] mt-1" />
        </View>
        <View className="flex flex flex-col">
          {subscriptionDetails.productList.map((el, key) => (
            <View className="mt-1 flex item-center h-[160px]" key={key}>
              <Image className="mx-1 h-full" src={el?.variants?.defaultImage} style={{ width: '1.6rem' }} />
              <View className="h-full flex flex-col justify-center flex-1">
                <View className="font-bold text-[30px]">{el?.variants?.name}</View>
                <View className="flex items-center justify-between mt-1 text-[24px] text-[#333]">
                  {formatMoney(el?.variants?.subscriptionPrice)}
                </View>
                <View className="flex items-center justify-end mt-1 text-[20px] text-[#9D9D9D]">
                  X {el?.variants?.num}
                </View>
              </View>
            </View>
          ))}
        </View>
        <AtList hasBorder={false} className="my-2">
          <AtListItem
            className="py-0.5"
            title="商品金额"
            hasBorder={false}
            extraText={formatMoney(subscriptionDetails.price.productPrice + subscriptionDetails.price.deliveryPrice)}
          />
          <AtListItem
            className="py-0.5"
            title="促销折扣"
            hasBorder={false}
            extraText={formatMoney(subscriptionDetails.price.discountsPrice)}
          />
          <AtListItem
            className="py-0.5"
            title="运费"
            extraText={formatMoney(subscriptionDetails.price.deliveryPrice)}
          />
          <View className="flex items-center justify-between py-1.5">
            <View
              className="underline text-[24px]"
              onClick={(e) => {
                e.stopPropagation()
                setPopupOpne(true)
              }}
            >
              <AtIcon className="ml-[30px] mr-[10px]" value="close-circle" size="22" />
              取消计划
            </View>
            <View className="TotalPrice">
              <Text className="item-content__info-title" style={{ color: '#000' }}>
                合计：
              </Text>
              <Text className="item-extra__info" style={{ color: '#D49D28' }}>
                {formatMoney(subscriptionDetails?.price?.totalPrice)}
              </Text>
            </View>
          </View>
        </AtList>
      </View>
      <View className="bg-white mt-1 p-1 pb-2 boxShadow text-[24px]">
        <View className="text-[34px]">发货信息</View>
        <View className="w-[30px] h-[4px] bg-[#96CC39] mt-1" />
        <View className="mt-1 flex">
          <AtIcon value="calendar" size="22" color="#D49D28" />
          <Text className="ml-[6px]">
            发货日期&nbsp;&nbsp;&nbsp;{moment(subscriptionDetails.createNextDeliveryTime).format('YYYY-MM-DD')}
          </Text>
        </View>
        <View className="mt-1 flex">
          <Text
            className="rcciconfont rccicon-location text-[#D49D28]"
            style={{
              fontSize: '0.42rem',
            }}
          />
          <Text className="ml-[6px] flex-1 leading-[28px]">
            收货地址&nbsp;&nbsp;&nbsp;{subscriptionDetails?.address?.city} {subscriptionDetails?.address?.region}{' '}
            {subscriptionDetails?.address?.detail}
          </Text>
        </View>
        <View className="flex mt-2 justify-end">
          <AtButton circle className="w-[228px] h-[64px] leading-[64px] text-[24px] m-0" type="primary">
            修改地址
          </AtButton>
        </View>
      </View>
      <View className="bg-white mt-1 p-1 boxShadow">
        <View className="text-[34px]">历史订单</View>
        <View className="w-[30px] h-[4px] bg-[#96CC39] mt-1" />
        <View className="rounded-[10px] mt-1 text-[22px] text-[#999] border border-solid border-[#E2E2E2]">
          <View className="flex items-center justify-between p-1">
            <View>
              订单编号: 201852750697
              <Text
                className="rounded-[8px] text-black bg-[#EAEAEA] mx-0.5 px-0.5"
                onClick={(e) => {
                  e.stopPropagation()
                  Taro.setClipboardData({
                    data: 'xx',
                  })
                }}
              >
                复制
              </Text>
            </View>
            第2笔
          </View>
          <View
            className="flex item-center h-[160px] p-1"
            style={{
              borderBottom: '1px solid #E2E2E2',
              borderTop: '1px solid #E2E2E2',
            }}
          >
            <Image className="mr-1 h-full" src="https://jdc.jd.com/img/200" style={{ width: '1.6rem' }} />
            <View className="h-full flex flex-col justify-center flex-1">
              <View className="font-bold text-[30px]">牛肉泥</View>
              <View className="flex items-center justify-between mt-1 text-[24px] text-[#333]">¥129.00</View>
              <View className="flex items-center justify-end mt-1 text-[20px] text-[#9D9D9D]">X 1</View>
            </View>
          </View>
          <View className="p-1 text-right text-[24px] text-[#666]">发货日期:2022-08-23</View>
        </View>
      </View>
      {/* 弹出层 */}
      <View
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center"
        style={{
          display: PopupOpne ? 'flex' : 'none',
        }}
        onClick={(e) => {
          e.stopPropagation()
          setPopupOpne(false)
        }}
      >
        <View>
          <View
            className="w-[650px] bg-white rounded-[50px] flex flex-col items-center"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Image className="mt-2" src={`${CDNIMGURL}pop.png`} style={{ width: '2.36rem', height: '2.36rem' }} />
            <View className="text-[29px] text-[#333] mt-2">您确定要取消这个计划嘛？</View>
            <View className="flex items-center justify-between my-2">
              <AtButton
                circle
                className="w-[190px] h-[60px] leading-[60px] text-[24px] text-white m-0 border-0 bg-[#C8E399]"
              >
                确定
              </AtButton>
              <AtButton
                circle
                className="w-[190px] h-[60px] leading-[60px] text-[24px] text-white m-0 border-0 bg-[#96CC39] ml-2"
                onClick={(e) => {
                  e.stopPropagation()
                  setPopupOpne(false)
                }}
              >
                我在想想
              </AtButton>
            </View>
          </View>
          <View className="flex justify-center mt-3">
            <AtIcon value="close-circle" size={30} color="#fff" />
          </View>
        </View>
      </View>
    </View>
  )
}

export default Schedule