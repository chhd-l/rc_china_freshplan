import { payFromOrder } from '@/framework/api/payment/pay'
import { Order } from '@/framework/types/order'
import { handleReturnTime } from '@/utils/utils'
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
      className="px-1.5 py-[0.2rem] bg-white mx-[25px] mt-[40px] orderCard"
      onClick={() =>
        Taro.navigateTo({
          url: '/pages/packageA/orderDetail/index?id=' + order.orderNumber,
        })
      }
    >
      <View className="flex items-center justify-between">
        <Text className="text-[28px]">{orderStatusType[order?.orderState?.orderState || '']}</Text>
        <Text className="text-[22px] text-[#666]">创建时间:{handleReturnTime(order?.orderState?.createdAt)}</Text>
      </View>
      <View className="my-[28px] flex items-center">
        {(order?.lineItem?.filter((el) => !el.isGift) || []).map((el, key) => (
          <View key={key} className="w-[150px] h-[150px] rounded-[10px] mr-[22px]">
            <Image
              style={{
                height: '100%',
              }}
              src={el?.pic}
            />
          </View>
        ))}
      </View>
      <View className="mb-[48px] flex items-center justify-between">
        <Text className="text-[26px] text-[#666]">商品合计</Text>
        <Text className="font-bold text-[34px]">
          <Text className="text-[24px]">￥</Text>
          {order.orderPrice.totalPrice.toFixed(2)}
        </Text>
      </View>
      <View>
        {order.orderState?.orderState === 'UNPAID' && (
          <View className="flex items-center justify-end my-[0.1rem]">
            <AtButton
              className="rounded-full m-0"
              onClick={(e) => {
                e.stopPropagation()
                orderButton(order.orderNumber, order?.orderState?.orderState)
              }}
            >
              取消
            </AtButton>
            <AtButton
              className="m-0 ml-[20px] rounded-full"
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
          <View className="flex items-center justify-between my-[0.1rem]">
            <View
              className="text-[28px] relative moreHover"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              更多
              <View
                // className={`absolute bottom-[-102px] flex items-center justify-center left-[-12px] w-[200px] h-[108px] bg-white text-[30px] rounded-[5px] more ${
                //   moreOpen ? 'absolute' : 'hidden'
                // }`}
                className="absolute bottom-[-102px] flex items-center justify-center left-[-12px] w-[200px] h-[108px] bg-white text-[30px] rounded-[5px] more"
                onClick={(e) => {
                  e.stopPropagation()
                  Invoice()
                }}
              >
                <Text className="pt-[11px]">申请开票</Text>
              </View>
            </View>
            <View className="flex items-cennter justify-end">
              <AtButton className="rounded-full m-0 mx-[20px]">查看物流</AtButton>
              <AtButton
                type="primary"
                className="rounded-full m-0"
                onClick={(e) => {
                  e.stopPropagation()
                  orderButton(order.orderNumber, order?.orderState?.orderState)
                }}
              >
                确认收货
              </AtButton>
            </View>
          </View>
        )}
        {order.orderState?.orderState === 'COMPLETED' && (
          <View className="flex items-center justify-end my-[0.1rem]">
            <AtButton className="rounded-full m-0">查看详情</AtButton>
            <AtButton
              className="rounded-full m-0 ml-0.5"
              onClick={(e) => {
                e.stopPropagation()
                Invoice()
              }}
            >
              {order?.orderState?.orderType ? '查看' : '申请'}开票
            </AtButton>
          </View>
        )}
        {order.orderState?.orderState === 'TO_SHIP' && (
          <View className="flex items-center justify-end my-[0.1rem]">
            <AtButton
              className="rounded-full m-0"
              onClick={(e) => {
                e.stopPropagation()
                orderButton(order.orderNumber, order?.orderState?.orderState)
              }}
            >
              催发货
            </AtButton>
            <AtButton
              className="rounded-full m-0 ml-[20px]"
              onClick={(e) => {
                e.stopPropagation()
                Invoice()
              }}
            >
              {order?.orderState?.orderType ? '查看' : '申请'}开票
            </AtButton>
          </View>
        )}
        {order.orderState?.orderState === 'VOID' && (
          <View className="flex items-center justify-end my-[0.1rem]">
            <AtButton
              className="rounded-full m-0"
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
  )
}

export default OrderCard
