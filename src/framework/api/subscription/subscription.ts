import apis from '@/framework/config/api-config'
import Taro from '@tarojs/taro'
import omit from 'lodash/omit'
import { formatDateToApi } from '@/utils/utils'
import { pay } from '@/framework/api/payment/pay'
import { normalizePetsForApi } from '@/framework/api/lib/normalize'
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
  address,
  remark,
  deliveryTime,
  pet,
}) => {
  try {
    const productList = orderItems.map((el) => {
      if (el?.variants?.id) {
        el.variants = Object.assign(omit(el.variants, ['isDeleted', 'variantBundles']), {
          num: 6,
        })
      }
      if (el?.specifications?.length > 0) {
        el.specifications = el.specifications.map((item: any) => {
          if (item?.specificationDetails?.length > 0) {
            item.specificationDetails = item.specificationDetails.map((t: any) => {
              return omit(t, ['isDeleted']);
            })
          }
          return omit(item, ['isDeleted']);
        })
      }
      el = omit(el, ['isDeleted', 'subscriptionRecommendRuleId', 'asserts'])
      return el
    })
    const addressInfo = omit(address, ['consumerId', 'storeId', 'isDefault'])
    let wxLoginRes = Taro.getStorageSync('wxLoginRes')
    const subscriptionInput = {
      description: 'description',
      type: "FRESH_PLAN",
      cycle: null,
      freshType: null,
      voucher: null,
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
          isWXGroupVip: false,
        },
      },
      pet: normalizePetsForApi(pet),
      source: 'ALIPAY_MINI_PROGRAM',
      address: addressInfo.id !== '' ? addressInfo : null,
      productList,
      benefits: null,
      coupons: null,
      remark,
      firstDeliveryTime: formatDateToApi(deliveryTime),
      totalDeliveryTimes: 6, //配送次数
    }
    let params = {
      input: subscriptionInput,
      payWayId: 'e47dfb0f-1d3f-11ed-8ae8-00163e02a658',
      storeId: wxLoginRes?.userInfo?.storeId,
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
        Taro.reLaunch({
          url,
        })
      }, 1000)
      return
    }
    let aliPaymentReq = res.paymentStartResult?.aliPaymentRequest;
    let paymentObj = res.paymentStartResult?.payment;
    if (aliPaymentReq) {
      console.log(res, 'subscriptionCreateAndPayressssss')
      Taro.removeStorageSync('select-product')
      my.tradePay({
        // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
        tradeNO: aliPaymentReq?.payWayOrderId,
        success: async (res) => {
          console.log(res);
          if (res.resultCode === "9000" || res.resultCode === "8000") {
            await ApiRoot({ url: apis?.payment }).payments().syncOrder({
              input: {
                paymentId: paymentObj?.id,
                storeId: wxLoginRes?.userInfo?.storeId,
              },
            });
          }
          Taro.reLaunch({
            url: `${routers.orderList}?status=ALL&isFromSubscription=true`,
          })
        },
        fail: (res) => {
          console.log(res);
          Taro.reLaunch({
            url: `${routers.orderList}?status=UNPAID&isFromSubscription=true`,
          })
        }
      });
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

export const updateSubscriptionAddress = async (id: string, address: any) => {
  const res = await ApiRoot({ url: apis?.sc_subscription }).subscriptions().updateSubscriptionAddress(id, address)
  console.log("update subscription address view data:", res)
  return res?.subscriptionUpdateAddress || false
}

export const cancelSubscription = async ({
  subscriptionId,
  subscriptionType,
  agreementNo,
  aliPayUserId
}: {
  subscriptionId: string,
  subscriptionType: string,
  agreementNo?: string,
  aliPayUserId?: string
}) => {
  const res = await ApiRoot({ url: apis?.sc_subscription }).subscriptions().cancelSubscription({
    subscriptionId,
    subscriptionType,
    agreementNo,
    aliPayUserId,
  });
  console.log("cancel subscription view data:", res);
  return res?.subscriptionCancel ?? false;
}
