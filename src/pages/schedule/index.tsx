import { cancelSubscription, getSubscriptionDetail } from '@/framework/api/subscription/subscription'
import { CDNIMGURL } from '@/lib/constants'
import routers from '@/routers'
import { formatMoney } from '@/utils/utils'
import { Image, Text, View } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import moment from 'moment'
import { useState } from 'react'
import { AtButton, AtIcon, AtList, AtListItem } from 'taro-ui'
import './index.less'

const Schedule = () => {
  const [PopupOpne, setPopupOpne] = useState(false)
  const { router } = getCurrentInstance()
  const [subscriptionDetails, setSubscriptionDetails] = useState({
    productList: [{ name: '', variants: { name: '', defaultImage: '', num: 0, subscriptionPrice: 0 } }],
    no: '',
    id: '',
    createNextDeliveryTime: 0,
    consumer: { phone: '' },
    address: {
      city: '',
      region: '',
      detail: '',
      province: '',
    },
    price: {
      deliveryPrice: 0,
      discountsPrice: 0,
      productPrice: 0,
      totalPrice: 0,
    },
    status: '',
    completedDeliveries: [],
  })
  const getSubscriptionDetails = async (id: string) => {
    let res = await getSubscriptionDetail(id)
    console.log('res', res)
    setSubscriptionDetails(res)
  }

  Taro.useDidShow(() => {
    const subId = router?.params?.id ?? ''
    getSubscriptionDetails(subId)
  })

  return (
    <View className="p-1 pb-4 Schedule">
      <View className="bg-white mt-1 px-1 boxShadow">
        <View className="pt-1">
          <View className="flex justify-between items-end">
            <Text className="text-[34px] font-bold">
              {subscriptionDetails.status !== 'VOID' ? '下次发货' : 'Fresh Plan商品'}
            </Text>
            {subscriptionDetails.status === 'VOID' && <Text className="text-[#EE2737] text-[28px]">计划已取消</Text>}
          </View>
        </View>
        <View className="mt-1 flex flex flex-col">
          {subscriptionDetails.productList.map((el, key) => (
            <View className="flex item-center h-[160px]" key={key}>
              <Image className="mx-1 h-full" src={el?.variants?.defaultImage} style={{ width: '1.6rem' }} />
              <View className="h-full flex flex-col flex-1">
                <View className="font-bold text-[30px] flex items-center justify-between">
                  <View>{el?.name}</View>
                  <View className="flex items-center justify-end text-[20px] text-[#9D9D9D]">
                    X {el?.variants?.num}
                  </View>
                </View>
                <View className="flex items-center justify-between mt-1 text-[24px] text-[#333]">
                  {formatMoney(el?.variants?.subscriptionPrice)}
                </View>
              </View>
            </View>
          ))}
        </View>
        <AtList hasBorder={false} className="my-2">
          <AtListItem
            className="py-0.5 text-[28px]"
            title="商品金额"
            hasBorder={false}
            extraText={formatMoney(subscriptionDetails.price.productPrice + subscriptionDetails.price.deliveryPrice)}
          />
          <AtListItem
            className="py-0.5 text-[28px]"
            title="促销折扣"
            hasBorder={false}
            extraText={formatMoney(subscriptionDetails.price.discountsPrice)}
          />
          <AtListItem
            className="py-0.5 text-[28px]"
            title="运费"
            extraText={formatMoney(subscriptionDetails.price.deliveryPrice)}
          />
          <View
            className="flex items-center justify-end py-1"
            style={{
              borderBottom: subscriptionDetails.status !== 'VOID' ? '1px solid #E2E2E2' : '',
            }}
          >
            <View>
              <Text className="text-[28px]" style={{ color: '#000' }}>
                商品小计：
              </Text>
              <Text className="text-[40px] mr-[24px]" style={{ color: '#D49D28' }}>
                <Text className="text-[26px]">￥</Text>
                {subscriptionDetails?.price?.totalPrice.toFixed(2)}
              </Text>
            </View>
          </View>
          {subscriptionDetails.status !== 'VOID' && (
            <View
              className="text-[24px] flex items-center justify-center text-[#999] py-1"
              onClick={(e) => {
                e.stopPropagation()
                setPopupOpne(true)
              }}
            >
              <AtIcon className="ml-[30px] mr-[10px]" color="#999" value="close-circle" size="16" />
              <Text className="leading-[33px]">取消计划</Text>
            </View>
          )}
        </AtList>
      </View>
      <View className="bg-white mt-1 p-1 pb-2 boxShadow text-[28px]">
        <View className="text-[34px]">发货信息</View>
        {subscriptionDetails.status !== 'VOID' && (
          <View className="mt-1 flex pr-[18px]">
            <AtIcon value="calendar" size="16" />
            <Text className="ml-[6px] text-[#666]">
              发货日期&nbsp;&nbsp;&nbsp;{moment(subscriptionDetails.createNextDeliveryTime).format('YYYY-MM-DD')}
            </Text>
          </View>
        )}
        <View className="mt-1 flex pr-[18px]">
          <Text
            className="rcciconfont rccicon-location"
            style={{
              fontSize: '0.32rem',
            }}
          />
          <Text className="ml-[6px] flex-1 leading-[28px] text-[#666]">
            收货地址&nbsp;&nbsp;&nbsp;{subscriptionDetails?.address?.province} {subscriptionDetails?.address?.city}{' '}
            {subscriptionDetails?.address?.region} {subscriptionDetails?.address?.detail}
          </Text>
        </View>
        {subscriptionDetails.status !== 'VOID' && (
          <View className="flex mt-2 justify-end">
            <AtButton
              circle
              className="w-[228px] h-[64px] leading-[64px] text-[24px] m-0 flex items-center justify-center border-[#ECEEF1]"
              onClick={() => {
                Taro.setStorage({
                  key: 'current-address',
                  data: JSON.stringify(subscriptionDetails?.address),
                  success: function () {
                    Taro.navigateTo({
                      url: `${routers.addressManage}?type=edit&subscriptionDetailsID=${subscriptionDetails?.id}`,
                    })
                  },
                })
              }}
            >
              修改地址
            </AtButton>
          </View>
        )}
      </View>

      {/* 历史订单 */}

      {subscriptionDetails.completedDeliveries && subscriptionDetails.completedDeliveries.length ? (
        <View className="bg-white mt-1 p-1 boxShadow">
          <View className="text-[34px]">历史订单</View>
          {subscriptionDetails.completedDeliveries.map((el: any, key) => (
            <View
              key={key}
              className="rounded-[10px] mt-1 text-[24px] text-[#999] border border-solid border-[#E2E2E2]"
            >
              <View className="flex items-center justify-between p-1">
                <View>订单编号: {el?.orderId}</View>第{key + 1}笔
              </View>
              <View
                style={{
                  borderBottom: '1px solid #E2E2E2',
                  borderTop: '1px solid #E2E2E2',
                }}
              >
                {el?.lineItems.map((item, index) => (
                  <View className="flex item-center h-[160px] p-1" key={index}>
                    <Image className="mr-1 h-full" src={item?.pic} style={{ width: '1.6rem' }} />
                    <View className="h-full flex flex-col justify-center flex-1">
                      <View className="font-bold text-[28px] text-[#000] flex justify-between">
                        <Text>{item?.skuName}</Text>
                        <View className="flex items-center justify-end mt-[10px] text-[20px] text-[#9D9D9D]">
                          X {item?.num}
                        </View>
                      </View>
                      <View className="flex items-center justify-between mt-1 text-[24px] text-[#333]">
                        {formatMoney(item?.price)}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
              <View className="p-1 text-right text-[24px] text-[#666]">
                发货日期:{moment(el?.shipmentDate).format('YYYY-MM-DD')}
              </View>
            </View>
          ))}
        </View>
      ) : null}

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
                onClick={async () => {
                  let res = await cancelSubscription({
                    subscriptionId: subscriptionDetails?.id,
                    subscriptionType: 'FRESH_PLAN',
                  })
                  setPopupOpne(false)
                  if (res) {
                    getSubscriptionDetails(router?.params?.id || '')
                  }
                }}
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
