import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import './index.less'

const OrderCard = () => {
  return (
    <View
      className="p-1 bg-white mt-1 orderCard"
      onClick={() =>
        Taro.navigateTo({
          url: '/pages/orderDetail/index',
        })
      }
    >
      <View className="flex items-center justify-between">
        <Text className="orderNo">订单编号: E2022072614122210552750697</Text>
        <Text className="orderState">等待买家付款</Text>
      </View>
      <View className="my-2 flex orderBody">
        <Image className="orderImage mx-1 h-full rounded-full" src="https://jdc.jd.com/img/200" />
        <View className="h-full flex flex-col justify-between flex-1" style={{ fontWeight: 700 }}>
          <View>鸡肉料理</View>
          <View className="flex items-center justify-between">
            <Text>
              <Text className="orderPrice">￥15.</Text>00
            </Text>
            <Text style={{ color: '#9D9D9D', fontWeight: 400 }}>X 1</Text>
          </View>
        </View>
      </View>
      <View className="flex flex-col items-end">
        <View className="mb-1">需付款：&nbsp;￥7.50</View>
        <View className="flex items-center">
          <AtButton
            className="rounded-full"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            取消
          </AtButton>
          <AtButton
            className="ml-0.5 rounded-full"
            type="primary"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            付款
          </AtButton>
        </View>
        <View className="flex items-center">
          <AtButton className="rounded-full">查看详情</AtButton>
        </View>
      </View>
    </View>
  )
}

export default OrderCard
