import { payFromOrder } from '@/framework/api/payment/pay'
import { Order } from '@/framework/types/order'
import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import './index.less'

const orderStatusType = {
  UNPAID: '待付款',
  TO_SHIP: '待发货',
  SHIPPED: '待收货',
  COMPLETED: '交易成功',
  VOID: '交易关闭',
}

const OrderCard = ({ order, orderButton }: { order: Order; orderButton: Function }) => {
  const Invoice = () => {
    Taro.navigateTo({ url: `/pages/packageA/invoiceDetail/index?orderno=${order.orderNumber}` })
  }

  return (
    <View
      className="p-1 bg-white mt-1 orderCard m-[30px]"
      onClick={() =>
        Taro.navigateTo({
          url: '/pages/packageA/orderDetail/index?id=' + order.orderNumber,
        })
      }
    >
      <View className="flex items-center justify-between">
        <Text className="text-[28px]">{orderStatusType[order?.orderState?.orderState || '']}</Text>
        <Text className="text-[22px] text-[#666]">创建时间:2022-06-21 12:13:34</Text>
      </View>
      <View className="my-[40px] flex items-center">
        {(order?.lineItem?.filter((el) => !el.isGift) || []).map((el, key) => (
          <View key={key} className="w-[150px] h-[150px] border border-solid border-[#f1f1f1] rounded-[10px] mr-[22px]">
            <Image
              style={{
                height: '100%',
              }}
              src={el?.pic}
            />
          </View>
        ))}
      </View>
      <View className="flex justify-between items-center">
        <Text className="font-bold text-[24px]">
          <Text className="text-[16px]">￥</Text>
          {order.orderPrice.totalPrice.toFixed(2)}
        </Text>
        <View>
          {order.orderState?.orderState === 'UNPAID' && (
            <View className="flex items-center my-[0.1rem]">
              <AtButton
                className="rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  orderButton(order.orderNumber, order?.orderState?.orderState)
                }}
              >
                取消
              </AtButton>
              <AtButton
                className="ml-[20px] rounded-full"
                type="primary"
                onClick={(e) => {
                  e.stopPropagation()
                  payFromOrder(order)
                }}
              >
                付款
              </AtButton>
            </View>
          )}
          {order.orderState?.orderState === 'SHIPPED' && (
            <View className="flex items-center my-[0.1rem]">
              <Text className="text-[28px]">更多</Text>
              <AtButton className="rounded-full mx-[20px]">查看物流</AtButton>
              <AtButton
                type="primary"
                className="rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  orderButton(order.orderNumber, order?.orderState?.orderState)
                }}
              >
                确认收货
              </AtButton>
            </View>
          )}
          {order.orderState?.orderState === 'COMPLETED' && (
            <View className="flex items-center my-[0.1rem]">
              <AtButton className="rounded-full m-0">查看详情</AtButton>
              <AtButton
                className="rounded-full ml-0.5"
                onClick={(e) => {
                  e.stopPropagation()
                  Invoice()
                }}
              >
                {order?.orderState?.invoiceStatus ? '查看' : '申请'}开票
              </AtButton>
            </View>
          )}
          {order.orderState?.orderState === 'TO_SHIP' && (
            <View className="flex items-center my-[0.1rem]">
              <AtButton
                className="rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  orderButton(order.orderNumber, order?.orderState?.orderState)
                }}
              >
                催发货
              </AtButton>
              <AtButton
                className="rounded-full ml-[20px]"
                onClick={(e) => {
                  e.stopPropagation()
                  Invoice()
                }}
              >
                {order?.orderState?.invoiceStatus ? '查看' : '申请'}开票
              </AtButton>
            </View>
          )}
          {order.orderState?.orderState === 'VOID' && (
            <View className="flex items-center my-[0.1rem]">
              <AtButton
                className="rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  orderButton(order.orderNumber, order?.orderState?.orderState)
                }}
              >
                删除订单
              </AtButton>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default OrderCard
