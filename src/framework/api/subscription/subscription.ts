import apis from '@/framework/config/api-config'
import Taro from '@tarojs/taro'
import omit from 'lodash/omit'
import { formatDateToApi } from '@/utils/utils'
import { pay } from '@/framework/api/payment/pay'
import routers from '@/routers'
import ApiRoot from '../fetcher'

export const getSubscriptionSimpleRecommend = async (params: any) => {
  try {
    const { subscriptionSimpleRecommend } = await ApiRoot({ url: apis.subscriptionRecommend }).subscriptions().subscriptionSimpleRecommend({ body: params })
    let { couponList, couponInfoList } = subscriptionSimpleRecommend
    couponList?.forEach((el) => {
      el.coupons?.forEach((coupon) => {
        coupon.couponInfo = couponInfoList.find((info) => info.id === coupon.couponId)
      })
    })
    console.info('subscriptionSimpleRecommend', subscriptionSimpleRecommend)
    return subscriptionSimpleRecommend
  } catch (err) {
    return {}
  }
}

export const subscriptionCreateAndPay = async ({
  orderItems,
  giftItems,
  voucher,
  address,
  orderType,
  subscriptionInfo,
  couponItems,
  remark,
  deliveryTime,
  isWXGroupVip,
}) => {
  try {
    const productList = orderItems.map((el) => {
      if (el.skuGoodInfo.variants?.length > 0) {
        el.skuGoodInfo.variants = Object.assign(el.skuGoodInfo.variants[0], {
          num: el.productNum,
        })
      }
      return el.skuGoodInfo
    })
    const benefits = giftItems.map((el) => {
      if (el.skuGoodInfo.variants?.length > 0) {
        el.skuGoodInfo.variants = Object.assign(el.skuGoodInfo.variants[0], {
          num: el.productNum,
        })
      }
      return el.skuGoodInfo
    })
    let finalVoucher =
      voucher && JSON.stringify(voucher) !== '{}'
        ? {
          ...voucher,
          voucherStatus: 'Ongoing',
        }
        : null
    finalVoucher = finalVoucher
      ? omit(finalVoucher, ['consumerId', 'productInfoIds', 'orderCode', 'isDeleted', 'isGetStatus'])
      : null
    const addressInfo = omit(address, ['consumerId', 'storeId', 'isDefault'])
    let wxLoginRes = Taro.getStorageSync('wxLoginRes')
    const subscriptionInput = {
      description: 'description',
      type: orderType,
      cycle: subscriptionInfo.cycleObj?.cycle,
      freshType: subscriptionInfo.freshType,
      voucher: finalVoucher,
      consumer: {
        id: wxLoginRes?.userInfo?.id,
        avatarUrl: wxLoginRes?.userInfo?.avatarUrl,
        level: wxLoginRes?.userInfo?.level,
        phone: wxLoginRes?.userInfo?.phone,
        nickName: wxLoginRes?.userInfo?.nickName,
        name: wxLoginRes?.userInfo?.name,
        email: wxLoginRes?.userInfo?.email,
        points: wxLoginRes?.userInfo?.points,
        account: {
          unionId: wxLoginRes?.consumerAccount?.unionId,
          openId: wxLoginRes?.consumerAccount?.openId,
          isWXGroupVip
        },
      },
      pet: subscriptionInfo.pet,
      address: addressInfo.id !== '' ? addressInfo : null,
      productList,
      benefits,
      coupons: couponItems.map((el) => {
        let couponInfo = el.couponInfo
        delete couponInfo.isDeleted
        delete couponInfo.isGetStatus
        return {
          id: el.id,
          subscriptionRecommendRuleId: el.subscriptionRecommendRuleId,
          couponId: el.couponId,
          quantityRule: el.quantityRule,
          quantity: el.quantity,
          voucher: couponInfo,
          sequence: el.sequence,
          num: el.quantity,
        }
      }),
      remark,
      firstDeliveryTime: formatDateToApi(deliveryTime),
      totalDeliveryTimes: subscriptionInfo.cycleObj.quantity, //配送次数
    }
    let params = {
      input: subscriptionInput,
      payWayId: '241e2f4e-e975-6e14-a62a-71fcd435e7e9',
      storeId: '12345678',
      operator: wxLoginRes?.userInfo?.nickName || '',
    }
    console.log('create order params', params)
    const res = await ApiRoot(({ url: apis.subscription })).subscriptions().subscriptionCreateAndPay({ body: params })
    console.info('subscriptionCreateAndPay', res)
    if (res.paymentStartResult?.payment?.status === 'PAID') {
      //0元就不用调用支付接口
      Taro.showToast({
        title: '支付成功',
        icon: 'success',
        duration: 1000
      })
      setTimeout(() => {
        let url = `${routers.orderList}?status=TO_SHIP&isFromSubscription=true`
        if (couponItems?.length) {
          url = `${routers.orderList}?status=TO_SHIP&isFromSubscription=true&isSendCoupon=true`
        }
        Taro.redirectTo({
          url,
        })
      }, 1000)
      return
    }
    let paymentInfo = res.paymentStartResult?.payment
    if (paymentInfo) {
      console.log(res, 'subscriptionCreateAndPayressssss')
      Taro.removeStorageSync('select-product')
      pay({
        params: {
          consumerId: wxLoginRes?.userInfo?.id || '',
          consumerOpenId: wxLoginRes?.consumerAccount?.openId,
          orderId: paymentInfo?.orderNo,
          orderNo: paymentInfo?.orderNo,
          orderDescription: '商品',
          payWayId: '241e2f4e-e975-6e14-a62a-71fcd435e7e9',
          amount: paymentInfo?.amount * 100,
          currency: 'CNY',
          storeId: '12345678',
          operator: wxLoginRes?.userInfo?.nickName || '',
        },
        success: () => {
          let url = `${routers.orderList}?status=TO_SHIP&isFromSubscription=true`
          if (couponItems?.length) {
            url = `${routers.orderList}?status=TO_SHIP&isFromSubscription=true&isSendCoupon=true`
          }
          Taro.redirectTo({
            url,
          })
        },
        fail: () => {
          Taro.redirectTo({
            url: `${routers.orderList}?status=UNPAID&isFromSubscription=true`,
          })
        },
        paymentRequest: res.paymentStartResult,
      })
    }
    return res
  } catch (err) {
    Taro.atMessage({
      message: '系统繁忙，请稍后再试',
      type: 'error',
    })
    return {}
  }
}

export const getSubscriptionFindByConsumerId = async () => {
  Taro.setStorageSync('commerce-loading', 1)
  let wxLoginRes = Taro.getStorageSync('wxLoginRes')
  if (!wxLoginRes?.userInfo?.id) return
  try {
    const { subscriptionFindByConsumerId } = await ApiRoot({ url: apis.subscription }).subscriptions().subscriptionFindByConsumerId({ consumerId: wxLoginRes?.userInfo?.id })
    return subscriptionFindByConsumerId
  } catch (err) {
    return []
  }
}

export const getSubscriptionDetail = async (id: any) => {
  try {
    const subscriptionDetail = await ApiRoot({ url: apis.common_subscription }).subscriptions().subscriptionDetail({ id })
    return subscriptionDetail
  } catch (err) {
    return {}
  }
}

export const getSubscriptionScheduleNextDelivery = async (params: any) => {
  try {
    const { subscriptionScheduleNextDelivery } = await ApiRoot({ url: apis.common_subscription }).subscriptions().subscriptionScheduleNextDelivery({
      body: params,
    })
    return subscriptionScheduleNextDelivery
  } catch (err) {
    return false
  }
}
