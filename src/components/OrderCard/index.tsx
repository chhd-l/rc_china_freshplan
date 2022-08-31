import { Order } from '@/framework/types/order'
import { CDNIMGURL } from '@/lib/constants'
import { formatMoney } from '@/utils/utils'
import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { payFromOrder } from '@/framework/api/payment/pay'
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

  const returnTypeImage = () => {
    switch (order?.orderState?.orderSource) {
      case 'WECHAT_MINI_PROGRAM':
        return 'WX.png'
      case 'ALIPAY_MINI_PROGRAM':
        return 'zhi.png'
      default:
        return 'WX.png'
    }
  }

  const nums = () => {
    let num = 0
    order?.lineItem?.forEach((item) => {
      num += Number(item.num)
    })
    return num
  }

  return (
    <View
      className="p-1 bg-white mt-1 orderCard"
      onClick={() =>
        Taro.navigateTo({
          url: '/pages/packageA/orderDetail/index?id=' + order.orderNumber,
        })
      }
    >
      <View
        className="flex items-center justify-between pb-1"
        style={{
          borderBottom: '1px solid #E2E2E2',
        }}
      >
        <Text className="orderNo flex items-center">
          <Image
            className="mr-[11px]"
            style={{
              width: '0.4rem',
              height: '0.4rem',
            }}
            src={`${CDNIMGURL}${returnTypeImage()}`}
          />
          订单编号: {order.orderNumber}
        </Text>
        <Text className="orderState">{orderStatusType[order?.orderState?.orderState || '']}</Text>
      </View>
      <View className="mb-1 flex flex flex-col">
        {(order?.lineItem?.filter((el) => !el.isGift) || []).map((el, key) => (
          <View className="orderBody mt-1 flex item-center" key={key}>
            <Image
              className="orderImage mr-1 rounded-[10px] h-full border border-solid border-[#E2E2E2]"
              src={el?.pic}
            />
            <View className="h-full flex flex-col flex-1" style={{ fontWeight: 700 }}>
              <View className="flex justify-between">
                <Text className="text-[26px] leading-[33px]">{el?.spuName}</Text>
                <Text className="text-[20px] leading-[23px] mt-[10px]" style={{ color: '#9D9D9D', fontWeight: 400 }}>
                  X {el?.num}
                </Text>
              </View>
              <View className="flex items-center justify-between mt-1.5">
                <Text>
                  <Text className="orderPrice">{formatMoney(Number(el?.price))}</Text>
                </Text>
              </View>
            </View>
          </View>
        ))}
        {(order?.lineItem?.filter((el) => el.isGift) || []).map((el, key) => (
          <View className="orderBody mt-2 flex item-center" key={key}>
            <Image
              className="orderImage mr-1 rounded-[10px] h-full border border-solid border-[#E2E2E2]"
              src={el?.pic}
            />
            <View className="h-full flex flex-col justify-between flex-1" style={{ fontWeight: 700 }}>
              <View className="text-[26px] leading-[28px]">{el?.spuName}</View>
              <View className="flex items-center justify-between">
                <Text>
                  <Text className="orderPrice">{el?.price}</Text>
                </Text>
                <Text style={{ color: '#9D9D9D', fontWeight: 400 }}>X {el?.num}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View className="flex flex-col items-end">
        <View className="w-full flex items-center justify-between text-[28px] mb-1">
          <View className="text-[#999]">共{nums()}件商品</View>
          <View>
            {order?.orderState?.orderState === 'UNPAID' || order?.orderState?.orderState === 'VOID'
              ? '需付款'
              : '实际支付'}
            ：&nbsp;
            {formatMoney(order.orderPrice.totalPrice + order.orderPrice.deliveryPrice)}
          </View>
        </View>
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
              className="ml-0.5 rounded-full"
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
            <AtButton
              className="rounded-full"
              onClick={(e) => {
                e.stopPropagation()
                Invoice()
              }}
            >
              查看发票
            </AtButton>
            <AtButton className="rounded-full ml-0.5">查看物流</AtButton>
            <AtButton
              type="primary"
              className="mx-0.5 rounded-full"
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
              申请开票
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
              className="rounded-full ml-0.5"
              onClick={(e) => {
                e.stopPropagation()
                Invoice()
              }}
            >
              申请开票
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
  )
}

export default OrderCard
