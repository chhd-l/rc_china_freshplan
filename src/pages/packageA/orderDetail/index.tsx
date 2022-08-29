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
import { AtButton, AtCountdown, AtList, AtListItem, AtModal } from 'taro-ui'
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
  const [showActionTipModal, setShowActionTipModal] = useState(false)
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
    setShowActionTipModal(false)
    if (res) {
      getOrder()
    }
  }

  //删除订单
  const deleteOrders = async () => {
    let res = await deleteOrder(orderId)
    setShowActionTipModal(false)
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
        return setShowActionTipModal(false)
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
    <ScrollView scrollY overflow-anchor={false} className="pb-1 OrderDetails">
      <View className="body">
        <View className="mt-1 px-2 pt-1.5 pb-2 flex items-center header">
          <Image className="mr-1 headerImage rounded-[17px]" src={`${CDNIMGURL2}${titleImageType()}`} />
          <View className="flex flex-col">
            <Text className="mb-[15px] leading-[32px]">
              {orderStatusType[orderDetail?.orderState?.orderState || '']}
            </Text>
            <Text className="leading-[30px]">{titleType()}</Text>
          </View>
        </View>
        {orderDetail?.orderState?.orderState !== 'VOID' && <TimeLine type={orderDetail?.orderState?.orderState} />}
        <View className="px-1 py-1 my-1 receiving relative" style={{ borderTop: '1px solid #EBEBEB' }}>
          {(orderDetail?.orderState?.orderState === 'SHIPPED' ||
            orderDetail?.orderState?.orderState === 'COMPLETED') && (
            <View className="express mb-1">
              <View className="flex items-end">
                <Image
                  className="mr-[15px]"
                  style={{
                    height: '0.45rem',
                    width: '0.45rem',
                  }}
                  src={`${CDNIMGURL}order%20logistics.png`}
                />
                <View className="flex items-center leading-[35px]">
                  <Text className="mr-0.5 text-[30px]">{getCarrierType()}</Text>
                  <CopyText str={orderDetail.delivery.trackingId} />
                </View>
              </View>
              <ExpressLine expressList={orderDetail.delivery.deliveryItems || []} />
            </View>
          )}
          <View className="my-0.5 receivingUser flex items-center">
            <Image
              className="mr-1"
              style={{
                height: '0.4rem',
                width: '0.35rem',
              }}
              src={`${CDNIMGURL}order%20address.png`}
            />
            <View>
              <View>
                <Text className="text-[30px]">{orderDetail.shippingAddress.receiverName}</Text>{' '}
                <Text className="text-[26px] text-[#999]">{orderDetail.shippingAddress.phone}</Text>
              </View>
              <View className="receivingAddress mt-0.5 text-[26px]">
                {orderDetail.shippingAddress.city} {orderDetail.shippingAddress.region}{' '}
                {orderDetail.shippingAddress.detail}
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className="bg-white mt-1 pb-1 orderAtCard px-1">
        <View className="orderAtCardTitle py-1 flex items-center">
          <Image
            className="mr-[11px]"
            style={{
              width: '0.3117rem',
              height: '0.3117rem',
            }}
            src={`${CDNIMGURL}${returnTypeImage()}`}
          />
          订单信息
        </View>
        <View className="flex flex flex-col">
          {(orderDetail?.lineItem?.filter((el) => !el.isGift) || []).map((el, key) => (
            <View className="orderAtCardBody mt-2 flex item-center pr-1" key={key}>
              <Image className="orderAtCardImage mx-1 h-full" src={el?.pic} />
              <View className="h-full flex flex-col flex-1" style={{ fontWeight: 700 }}>
                <View className="flex item-center justify-between">
                  <Text>{el?.spuName}</Text>
                  <Text style={{ color: '#9D9D9D', fontWeight: 400 }}>X {el?.num}</Text>
                </View>
                <View className="mt-[28px]">
                  <Text className="orderAtCardPrice">{formatMoney(Number(el?.price))}</Text>
                </View>
              </View>
            </View>
          ))}
          {(orderDetail?.lineItem?.filter((el) => el.isGift) || []).map((el, key) => (
            <View className="orderAtCardBody mt-2 flex item-center pr-1" key={key}>
              <Image className="orderAtCardImage mx-1 rounded-full" src={el?.pic} />
              <View className="h-full flex flex-col justify-between flex-1" style={{ fontWeight: 700 }}>
                <View>{el?.spuName}</View>
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
      </View>
      <AtList hasBorder={false} className="my-1">
        <AtListItem
          className="py-[17px]"
          title="配送方式"
          extraText={'快递' + formatMoney(orderDetail.orderPrice.deliveryPrice)}
        />
        <AtListItem className="py-[17px]" hasBorder={false} title="买家留言" extraText={orderDetail.remark || '无'} />
      </AtList>
      <AtList hasBorder={false} className="mb-1">
        <AtListItem
          title="商品金额"
          className="py-[17px]"
          hasBorder={false}
          extraText={formatMoney(orderDetail.orderPrice.productPrice + orderDetail.orderPrice.deliveryPrice)}
        />
        <AtListItem
          title="折扣"
          className="py-[17px]"
          hasBorder={false}
          extraText={formatMoney(orderDetail.orderPrice.discountsPrice + orderDetail.orderPrice.vipDiscountsPrice)}
        />
        <AtListItem className="py-[17px]" title="运费" extraText={formatMoney(orderDetail.orderPrice.deliveryPrice)} />
        <View className="flex justify-end py-1.5">
          <Text className="TotalPrice">
            <Text className="text-[30px]" style={{ color: '#000' }}>
              合计：
            </Text>
            <Text className="text-[40px] font-bold" style={{ color: '#D49D28' }}>
              {formatMoney(orderDetail.orderPrice.totalPrice)}
            </Text>
          </Text>
        </View>
      </AtList>
      <View className="orderInfo pl-[24px] pr-[0.54rem] bg-white py-1.5 mb-3">
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
        {orderDetail?.orderState?.orderState !== 'UNPAID' && (
          <View className="flex items-center justify-between">
            <Text>付款方式：</Text>
            <Text className="copyText">{returnpayWayCode()}</Text>
          </View>
        )}
        {orderDetail?.orderState?.orderState !== 'UNPAID' && (
          <View className="flex items-center justify-between">
            <Text>付款时间：</Text>
            <Text className="copyText">{handleReturnTime(orderDetail?.payment?.paymentFinishTime)}</Text>
          </View>
        )}
        <View className="flex items-center justify-between">
          <Text>创建时间：</Text>
          <Text className="copyText">{handleReturnTime(orderDetail?.orderState?.createdAt)}</Text>
        </View>
      </View>
      <View className="pt-1 pb-1.5 bg-white orderFooter">
        {orderDetail?.orderState?.orderState === 'UNPAID' && (
          <View className="flex items-center justify-end">
            <View>
              <Text style={{ fontWeight: 700 }}>合计：</Text>
              <Text className="footerPrice">{formatMoney(orderDetail.orderPrice.totalPrice)}</Text>
            </View>
            <AtButton className="rounded-full m-0 ml-1 px-2" type="primary" onClick={() => payFromOrder(orderDetail)}>
              去支付
            </AtButton>
          </View>
        )}
        {orderDetail?.orderState?.orderState === 'TO_SHIP' && (
          <View className="flex items-center justify-end">
            <AtButton className="rounded-full m-0 mr-1 px-1.5 py-0" onClick={() => setShowActionTipModal(true)}>
              催发货
            </AtButton>
          </View>
        )}
        {orderDetail?.orderState?.orderState === 'VOID' && (
          <View className="flex items-center justify-end">
            <AtButton className="rounded-full m-0 px-1.5 mx-1 py-0" onClick={() => setShowActionTipModal(true)}>
              删除订单
            </AtButton>
          </View>
        )}
        {orderDetail?.orderState?.orderState === 'COMPLETED' && (
          <View className="flex items-center justify-end">
            <AtButton className="rounded-full m-0 px-1.5 mx-1 py-0">查看发票</AtButton>
          </View>
        )}
        {orderDetail?.orderState?.orderState === 'SHIPPED' && (
          <View className="flex items-center justify-end">
            <AtButton className="rounded-full m-0 px-1.5 mx-1 py-0">申请开票</AtButton>
            <AtButton
              className="rounded-full m-0 px-1.5 py-0 mr-1"
              type="primary"
              onClick={() => setShowActionTipModal(true)}
            >
              确认收获
            </AtButton>
          </View>
        )}
      </View>
      <AtModal
        isOpened={showActionTipModal}
        title="确认"
        content={getModalContent()}
        cancelText="取消"
        confirmText="确定"
        onClose={() => {
          setShowActionTipModal(false)
        }}
        onCancel={() => {
          setShowActionTipModal(false)
        }}
        onConfirm={() => handleClickActionTipModal()}
        className="rc_modal"
      />
    </ScrollView>
  )
}

export default OrderDetails
