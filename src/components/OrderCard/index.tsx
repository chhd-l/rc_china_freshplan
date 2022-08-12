import { formatMoney } from '@/utils/utils'
import { Order } from '@/framework/types/order'
import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import './index.less'

const orderStatusType = {
  UNPAID: '待付款',
  TO_SHIP: '待发货',
  SHIPPED: '待收货',
  COMPLETED: '已完成',
  VOID: '已取消',
}

const OrderCard = ({ order }: { order: Order }) => {
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
        <Text className="orderNo">订单编号: {order.orderNumber}</Text>
        <Text className="orderState">{orderStatusType[order?.orderState?.orderState || '']}</Text>
      </View>
      <View className="mb-2 flex flex flex-col">
        {(order?.lineItem?.filter((el) => !el.isGift) || []).map((el, key) => (
          <View className="orderBody mt-2 flex item-center" key={key}>
            <Image className="orderImage mx-1 h-full rounded-full" src={el?.pic} />
            <View className="h-full flex flex-col justify-between flex-1" style={{ fontWeight: 700 }}>
              <View>{el?.skuName}</View>
              <View className="flex items-center justify-between">
                <Text>
                  <Text className="orderPrice">{formatMoney(Number(el?.price))}.</Text>00
                </Text>
                <Text style={{ color: '#9D9D9D', fontWeight: 400 }}>X {el?.num}</Text>
              </View>
            </View>
          </View>
        ))}
        {(order?.lineItem?.filter((el) => el.isGift) || []).map((el, key) => (
          <View className="orderBody mt-2 flex item-center" key={key}>
            <Image className="orderImage mx-1 rounded-full" src={el?.pic} />
            <View className="h-full flex flex-col justify-between flex-1" style={{ fontWeight: 700 }}>
              <View>{el?.skuName}</View>
              <View className="flex items-center justify-between">
                <Text>
                  <Text className="orderPrice">{el?.price}</Text>00
                </Text>
                <Text style={{ color: '#9D9D9D', fontWeight: 400 }}>X {el?.num}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View className="flex flex-col items-end">
        <View className="mb-1">需付款：&nbsp;{formatMoney(order.orderPrice.totalPrice)}</View>
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
