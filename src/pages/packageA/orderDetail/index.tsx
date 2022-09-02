import {
  completedOrder,
  deleteOrder,
  getExpressCompanyList,
  getOrderDetail,
  getOrderSetting,
} from '@/framework/api/order'
import { payFromOrder } from '@/framework/api/payment/pay'
import { Order } from '@/framework/types/order'
import { CDNIMGURL, CDNIMGURL2 } from '@/lib/constants'
import { formatMoney, getDateDiff, handleReturnTime } from '@/utils/utils'
import { Image, ScrollView, Text, View } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { AtButton, AtCountdown, AtIcon, AtList, AtListItem } from 'taro-ui'
import CopyText from './copyText'
import ExpressLine from './expressLine'
import './index.less'
import TimeLine from './timeLine'

const orderStatusType = {
  UNPAID: '等待买家付款',
  TO_SHIP: '等待卖家发货',
  SHIPPED: '商家已发货',
  COMPLETED: '交易成功',
  VOID: '交易关闭',
}

const OrderDetails = () => {
  const [orderId, setOrderId] = useState('')
  const [showDelTip, setShowDelTip] = useState(false)
  const { router } = getCurrentInstance()
  const [orderCancelMinute, setOrderCancelMinute] = useState(30)
  const [carrierTypes, setCarrierTypes] = useState<any[]>([])
  const [orderDetail, setOrderDetail] = useState<Order>({
    shippingAddress: {
      receiverName: '',
      phone: '',
      province: '',
      city: '',
      region: '',
      detail: '',
    },
    orderPrice: {
      productPrice: 0,
      deliveryPrice: 0,
      totalPrice: 0,
      discountsPrice: 0,
      vipDiscountsPrice: 0,
    },
    delivery: {
      trackingId: '',
      deliveryItems: [],
    },
  })

  Taro.useReady(() => {
    my.setNavigationBar({ backgroundColor: '#C3EC7B', frontColor: '#000000' })
  })

  const getOrderCancelTime = async () => {
    const res = await getOrderSetting()
    const orderCancelSetting = res.filter((item) => item.code === 'order_超时时间')
    const orderCancelTime = orderCancelSetting.length > 0 ? Number(orderCancelSetting[0].context) : 30
    setOrderCancelMinute(orderCancelTime)
    return orderCancelTime
  }

  const getTimeCount = () => {
    const time = getDateDiff(orderDetail?.orderState?.createdAt, new Date(), orderCancelMinute)
    return {
      minutes: Number(time.minute.toFixed(0)),
      seconds: Number(time.second.toFixed(0)),
    }
  }

  const getOrder = async (id = orderId) => {
    const res = await getOrderDetail({ orderNum: id })
    setOrderDetail(res)
    await getOrderCancelTime()
  }

  const getExpressCompanys = async () => {
    const res = await getExpressCompanyList()
    setCarrierTypes(res)
  }

  const getCarrierType = () => {
    const carriers = carrierTypes.filter((item) => item?.code === orderDetail?.delivery?.shippingCompany)
    return carriers.length > 0 ? carriers[0].name : ''
  }

  //确认收货
  const completed = async () => {
    const res = await completedOrder({
      orderNum: orderId,
      nowOrderState: orderDetail?.orderState?.orderState,
    })
    setShowDelTip(false)
    if (res) {
      getOrder()
    }
  }

  //删除订单
  const deleteOrders = async () => {
    let res = await deleteOrder(orderId)
    setShowDelTip(false)
    if (res) {
      Taro.navigateBack()
    }
  }

  useEffect(() => {
    if (router?.params?.id) {
      setOrderId(router.params.id)
      getOrder(router.params.id)
    }
    getExpressCompanys()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.params?.id])

  const titleType = () => {
    switch (orderDetail?.orderState?.orderState) {
      case 'UNPAID':
        return (
          <View className="flex items-center">
            请于&nbsp;
            <AtCountdown
              className="timeText"
              format={{ hours: ':', minutes: ':', seconds: '' }}
              minutes={getTimeCount().minutes}
              seconds={getTimeCount().seconds}
            />
            内付款,超时订单将自动关闭
          </View>
        )
      case 'TO_SHIP':
        return '商家会在七天内发货'
      case 'SHIPPED':
        return '商品正在路上，请耐心等待'
      case 'COMPLETED':
        return '交易已完成！'
      case 'VOID':
        return '订单已取消'
      default:
        break
    }
  }

  const titleImageType = () => {
    switch (orderDetail?.orderState?.orderState) {
      case 'UNPAID':
        return 'wait-pay.png'
      case 'TO_SHIP':
        return 'wait-ship.png'
      case 'SHIPPED':
        return 'shipped.png'
      case 'COMPLETED':
        return 'completed.png'
      case 'VOID':
        return 'closed.png'
      default:
        break
    }
  }

  const getModalContent = () => {
    switch (orderDetail?.orderState?.orderState) {
      case 'TO_SHIP':
        return '已提醒发货，请耐心等待'
      case 'SHIPPED':
        return '确定已经收到货物吗？'
      case 'VOID':
        return '确定要删除该订单吗？'
      default:
        break
    }
  }

  const handleClickActionTipModal = () => {
    switch (orderDetail?.orderState?.orderState) {
      case 'TO_SHIP':
        return setShowDelTip(false)
      case 'SHIPPED':
        return completed()
      case 'VOID':
        return deleteOrders()
      default:
        break
    }
  }

  const returnTypeImage = () => {
    switch (orderDetail?.orderState?.orderSource) {
      case 'WECHAT_MINI_PROGRAM':
        return 'WX.png'
      case 'ALIPAY_MINI_PROGRAM':
        return 'zhi.png'
    }
  }

  const returnpayWayCode = () => {
    switch (orderDetail?.payment?.payWayCode) {
      case 'WECHAT_PAY':
        return '微信'
      case 'ALI_PAY':
        return '支付宝'
    }
  }
  return (
    <ScrollView scrollY overflow-anchor={false} className="p-1 pb-[1.5rem] OrderDetails">
      <View className="body">
        <View className="rounded-[16px] block-boxshadow">
          <View className="px-1 pt-1.5 pb-2 flex items-center header">
            <View className="flex flex-col">
              <Text className="mb-[15px] leading-[32px]">
                {orderStatusType[orderDetail?.orderState?.orderState || '']}
              </Text>
              <Text className="leading-[30px]">{titleType()}</Text>
            </View>
          </View>
          {orderDetail?.orderState?.orderState !== 'VOID' && <TimeLine type={orderDetail?.orderState?.orderState} />}
        </View>
        <View className="px-1 py-1 my-1 receiving relative rounded-[16px] block-boxshadow">
          {(orderDetail?.orderState?.orderState === 'SHIPPED' ||
            orderDetail?.orderState?.orderState === 'COMPLETED') && (
            <View className="express mb-[36px]">
              <View className="flex items-end">
                <Image
                  className="mr-[15px]"
                  style={{
                    height: '0.44rem',
                    width: '0.44rem',
                  }}
                  src={orderDetail?.delivery?.shippingCompanyImg ?? ''}
                />
                <View className="flex items-center leading-[35px] flex-1">
                  <Text className="mr-0.5 text-[30px]">{getCarrierType()}</Text>
                  <CopyText type str={orderDetail.delivery.trackingId} />
                </View>
              </View>
              <ExpressLine expressList={orderDetail.delivery.deliveryItems || []} />
            </View>
          )}
          <View className="my-0.5 receivingUser flex items-center">
            <Image
              className="mr-1"
              style={{
                height: '0.44rem',
                width: '0.38rem',
              }}
              src={`${CDNIMGURL2}gloc-icon.png`}
            />
            <View>
              <View>
                <Text className="text-[30px] font-bold">{orderDetail.shippingAddress.receiverName}</Text>
                <Text className="text-[26px] text-[#999] ml-[17px]">{orderDetail.shippingAddress.phone}</Text>
              </View>
              <View className="receivingAddress mt-0.5 text-[26px]">
                {orderDetail.shippingAddress.province} {orderDetail.shippingAddress.city}{' '}
                {orderDetail.shippingAddress.region} {orderDetail.shippingAddress.detail}
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className="bg-white mt-1 pb-1 orderAtCard px-1 rounded-[16px] block-boxshadow">
        <View className="orderAtCardTitle py-1 flex items-center">
          <Image
            className="mr-[11px]"
            style={{
              width: '0.34rem',
              height: '0.34rem',
            }}
            src={`${CDNIMGURL}${returnTypeImage()}`}
          />
          订单信息
        </View>
        <View className="flex flex flex-col">
          {(orderDetail?.lineItem?.filter((el) => !el.isGift) || []).map((el, key) => (
            <View className="orderAtCardBody mt-1 flex item-center" key={key}>
              <Image
                className="orderAtCardImage mr-1 rounded-[10px] h-full bg-[#E2E2E2]"
                src={el?.pic}
              />
              <View className="h-full flex flex-col flex-1" style={{ fontWeight: 700 }}>
                <View className="flex item-center justify-between">
                  <Text className="text-28 font-bold">{el?.spuName}</Text>
                  <Text style={{ color: '#9D9D9D', fontWeight: 400 }}>X {el?.num}</Text>
                </View>
                <View className="mt-[28px]">
                  <Text className="text-[24px] text-[#999] font-normal">{formatMoney(Number(el?.price))}</Text>
                </View>
              </View>
            </View>
          ))}
          {(orderDetail?.lineItem?.filter((el) => el.isGift) || []).map((el, key) => (
            <View className="orderAtCardBody mt-2 flex item-center" key={key}>
              <Image
                className="orderAtCardImage mr-1 rounded-[10px] h-full bg-[#E2E2E2]"
                src={el?.pic}
              />
              <View className="h-full flex flex-col justify-between flex-1" style={{ fontWeight: 700 }}>
                <View className="text-28 font-bold">{el?.spuName}</View>
                <View className="flex items-center justify-between">
                  <Text>
                    <Text className="orderAtCardPrice">{el?.price}</Text>
                  </Text>
                  <Text style={{ color: '#9D9D9D', fontWeight: 400 }}>X {el?.num}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View className="my-1 flex items-center justify-between">
          <View className="text-28 text-[#666]">商品金额</View>
          <View className="text-28">{formatMoney(orderDetail.orderPrice.productPrice + orderDetail.orderPrice.deliveryPrice)}</View>
        </View>
        <View className="my-1 flex items-center justify-between">
          <View className="text-28 text-[#666]">促销折扣</View>
          <View className="text-28">-{formatMoney(orderDetail.orderPrice.discountsPrice + orderDetail.orderPrice.vipDiscountsPrice)}</View>
        </View>
        <View className="my-1 flex items-center justify-between">
          <View className="text-28 text-[#666]">运费</View>
          <View className="text-28">{formatMoney(orderDetail.orderPrice.deliveryPrice)}</View>
        </View>
        <View className="pt-1 block-bordert flex items-center justify-end">
          <Text className="text-30 mr-1">合计：</Text>
          <Text className="text-40 text-[#D49D28] font-bold">{formatMoney(orderDetail.orderPrice.totalPrice)}</Text>
        </View>
      </View>
      <View className="orderInfo px-[24px] bg-white py-1.5 my-1 rounded-[16px]">
        <View className="flex items-center justify-between">
          <Text>配送方式</Text>
          <Text className="copyText">快递</Text>
        </View>
        <View className="flex items-center justify-between">
          <Text>订单编号：</Text>
          <CopyText str={orderDetail.orderNumber} />
        </View>
        <View
          className="flex items-center justify-between"
          onClick={() => {
            if (orderDetail.subscriptionNo?.length)
              Taro.navigateTo({
                url: '/pages/freshPlanDetails/index?id=' + orderDetail.subscriptionId,
              })
          }}
        >
          <Text>Fresh编号：</Text>
          <CopyText str={orderDetail.subscriptionNo} />
        </View>
        {orderDetail?.orderState?.orderState !== 'UNPAID' && orderDetail?.orderState?.orderState !== 'VOID' && (
          <View className="flex items-center justify-between">
            <Text>付款方式：</Text>
            <Text className="copyText">{returnpayWayCode()}</Text>
          </View>
        )}
        {orderDetail?.orderState?.orderState !== 'UNPAID' &&
          orderDetail?.orderState?.orderState !== 'VOID' &&
          orderDetail?.payment?.paymentFinishTime && (
            <View className="flex items-center justify-between">
              <Text>付款时间：</Text>
              <Text className="copyText">{handleReturnTime(orderDetail?.payment?.paymentFinishTime)}</Text>
            </View>
          )}
        <View className="flex items-center justify-between">
          <Text>创建时间：</Text>
          <Text className="copyText">{handleReturnTime(orderDetail?.orderState?.createdAt)}</Text>
        </View>
        <View className="flex items-center justify-between">
          <Text>买家留言：</Text>
        </View>
        <View className="rounded-sm p-1" style={{backgroundColor: '#f7f7f7'}}>{orderDetail.remark || '无'}</View>
      </View>
      <View className="pt-1 pb-2 bg-white orderFooter rounded-[16px] fixed left-0 bottom-0 w-full">
        {orderDetail?.orderState?.orderState === 'UNPAID' && (
          <View className="flex items-center justify-between">
            <View className="ml-1">
              <Text style={{ fontWeight: 700 }}>合计：</Text>
              <Text className="footerPrice">{formatMoney(orderDetail.orderPrice.totalPrice)}</Text>
            </View>
            <AtButton
              className="rounded-full m-0 mr-[24px] px-2"
              type="primary"
              onClick={() => payFromOrder(orderDetail)}
            >
              去支付
            </AtButton>
          </View>
        )}
        {orderDetail?.orderState?.orderState === 'TO_SHIP' && (
          <View className="flex items-center justify-end">
            <AtButton
              className="rounded-full m-0 px-1.5 mx-[24px] py-0"
              onClick={() => {
                Taro.navigateTo({ url: `/pages/packageA/invoiceDetail/index?orderno=${orderDetail.orderNumber}` })
              }}
            >
              {orderDetail?.orderState?.orderType ? '查看' : '申请'}开票
            </AtButton>
            <AtButton className="rounded-full m-0 mr-[24px] px-1.5 py-0" onClick={() => setShowDelTip(true)}>
              催发货
            </AtButton>
          </View>
        )}
        {orderDetail?.orderState?.orderState === 'VOID' && (
          <View className="flex items-center justify-end">
            <AtButton className="rounded-full m-0 px-1.5 mx-[24px] py-0" onClick={() => setShowDelTip(true)}>
              删除订单
            </AtButton>
          </View>
        )}
        {orderDetail?.orderState?.orderState === 'COMPLETED' && (
          <View className="flex items-center justify-end">
            <AtButton className="rounded-full m-0 px-1.5 mx-[24px] py-0">
              {orderDetail?.orderState?.orderType ? '查看' : '申请'}发票
            </AtButton>
          </View>
        )}
        {orderDetail?.orderState?.orderState === 'SHIPPED' && (
          <View className="flex items-center justify-end">
            <AtButton className="rounded-full m-0 px-1.5 mx-[24px] py-0">
              {orderDetail?.orderState?.orderType ? '查看' : '申请'}开票
            </AtButton>
            <AtButton
              className="rounded-full m-0 px-1.5 py-0 mr-[24px]"
              type="primary"
              onClick={() => setShowDelTip(true)}
            >
              确认收货
            </AtButton>
          </View>
        )}
      </View>

      {/* 弹出层 */}
      <View
        className="pop-modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center"
        style={{
          display: showDelTip ? 'flex' : 'none',
        }}
        onClick={(e) => {
          e.stopPropagation()
          setShowDelTip(false)
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
            <View className="text-[29px] text-[#333] mt-2">{getModalContent()}</View>
            <View className="flex items-center justify-between my-2">
              <AtButton
                circle
                className="w-[190px] h-[80px] leading-[80px] text-[24px] text-white m-0 border-0 bg-[#C8E399]"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDelTip(false)
                }}
              >
                取消
              </AtButton>
              <AtButton
                circle
                className="w-[190px] h-[80px] leading-[80px] text-[24px] text-white m-0 border-0 bg-[#96CC39] ml-2"
                onClick={handleClickActionTipModal}
              >
                确定
              </AtButton>
            </View>
          </View>
          <View className="flex justify-center mt-3">
            <AtIcon value="close-circle" size={30} color="#fff" />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default OrderDetails
