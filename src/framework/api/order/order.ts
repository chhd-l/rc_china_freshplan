import Taro from '@tarojs/taro'
import { orderDetailMockData, orderListMockData } from '@/mock/order'
import { session } from '@/utils/global'
import omit from 'lodash/omit'
import { pay } from '@/framework/api/payment/pay'
import routers from '@/routers'
import cloneDeep from 'lodash.cloneDeep'
import { formatDateToApi } from '@/utils/utils'
import ApiRoot, { baseSetting, isMock } from '../fetcher'

export const createOrder = async ({ orderItems, address, remark, deliveryTime, voucher }) => {
  try {
    //入参处理 start
    const productList = cloneDeep(orderItems).map((el) => {
      if (el.skuGoodInfo.productVariants?.length > 0 || el.skuGoodInfo.productVariant?.length > 0) {
        el.skuGoodInfo.productVariant = Object.assign(omit(el.skuGoodInfo.productVariants[0], ['isDeleted']), {
          num: el.productNum,
        })
      }
      el.skuGoodInfo = omit(el.skuGoodInfo, ['isDeleted', 'productVariants'])
      return el.skuGoodInfo
    })
    let shoppingCartIds: any[] = []
    orderItems.map((el) => {
      if (el?.id !== null && el.id !== undefined) {
        shoppingCartIds.push(el.id)
      }
    })
    const addressInfo = omit(address, ['consumerId', 'storeId', 'isDefault'])
    const user = Taro.getStorageSync('wxLoginRes').userInfo
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
    let wxLoginRes = Taro.getStorageSync('wxLoginRes')
    const params = {
      productList,
      addressInfo: addressInfo.id !== '' ? addressInfo : null,
      remark,
      shoppingCartIds: shoppingCartIds.length > 0 ? shoppingCartIds : [''],
      expectedShippingDate: formatDateToApi(deliveryTime),
      isSubscription: false,
      consumerInfo: {
        id: user.id,
        avatarUrl: user.avatarUrl,
        level: user.level,
        phone: user.phone,
        nickName: user.nickName,
        name: user.name,
      },
      operator: user.nickName,
      wxUserInfo: {
        nickName: user.nickName,
        unionId: wxLoginRes?.consumerAccount?.unionId,
        openId: wxLoginRes?.consumerAccount?.openId,
      },
      voucher: finalVoucher,
    }
    //入参处理 end
    console.log('create order params', params)
    const res = await ApiRoot.orders().createOrder({
      body: Object.assign(params, { storeId: baseSetting.storeId }),
    })
    console.log('create order view', res)
    if (res.createOrder) {
      Taro.removeStorageSync('select-product')
      //下单成功处理删除购物车数据
      let cartProducts = session.get('cart-data') || []
      orderItems.map((item) => {
        cartProducts.map((el) => {
          if (item.id === el.id) {
            const delIndex = cartProducts.findIndex((data) => data.id === item.id)
            cartProducts.splice(delIndex, 1)
          }
        })
      })
      session.set('cart-data', cartProducts)
      console.info('////////')
      pay({
        params: {
          consumerId: wxLoginRes?.userInfo?.id || '',
          consumerOpenId: wxLoginRes?.consumerAccount?.openId,
          orderId: res.createOrder?.orderNumber,
          orderNo: res.createOrder?.orderNumber,
          orderDescription: '商品',
          payWayId: '241e2f4e-e975-6e14-a62a-71fcd435e7e9',
          amount: res.createOrder?.orderPrice.totalPrice * 100,
          currency: 'CNY',
          storeId: '12345678',
          operator: wxLoginRes?.userInfo?.nickName || '',
        },
        success: () => {
          Taro.redirectTo({
            url: `${routers.orderList}?status=TO_SHIP`,
          })
        },
        fail: () => {
          Taro.redirectTo({
            url: `${routers.orderList}?status=UNPAID`,
          })
        },
      })
    }
    // else {
    //   Taro.atMessage({
    //     message: '系统繁忙，请稍后再试',
    //     type: 'error',
    //   })
    // }
    return res
  } catch (err) {
    console.log(err)
    Taro.atMessage({
      message: err?.errors?.Message || '系统繁忙，请稍后再试',
      type: 'error',
    })
    return []
  }
}

export const getOrderSetting = async () => {
  try {
    let orderSettings = Taro.getStorageSync('order-setting')
    if (orderSettings) {
      orderSettings = JSON.parse(orderSettings)
    } else {
      const res = await ApiRoot.orders().getOrderSetting({
        storeId: baseSetting.storeId,
      })
      console.log('get orderSetting view data', res)
      if (res.orderSettings) {
        orderSettings = res.orderSettings
        Taro.setStorageSync('order-setting', JSON.stringify(res.orderSettings))
      }
    }
    return orderSettings
  } catch (e) {
    console.log(e)
    return []
  }
}

export const getOrderList = async (queryOrderListParams: any) => {
  try {
    if (isMock) {
      return {
        total: 0,
        records: orderListMockData,
      }
    } else {
      console.log('query orders view params', queryOrderListParams)
      let wxLoginRes = Taro.getStorageSync('wxLoginRes')
      const params = Object.assign(queryOrderListParams, {
        storeId: wxLoginRes?.userInfo?.storeId || '12345678',
        operator: wxLoginRes?.userInfo?.nickName || 'system',
        isNeedTotal: true,
        sample: { ...queryOrderListParams?.sample, consumerId: wxLoginRes?.consumerAccount?.consumerId },
      })
      let res = await ApiRoot.orders().getOrders({ queryOrderListParams: params })
      const { records, total } = res.orders
      console.log('query orders view list', res)
      return {
        total: total || 0,
        records: records || [],
      }
    }
  } catch (e) {
    console.log(e)
    return {
      total: 0,
      records: [],
    }
  }
}

export const getOrderDetail = async ({ orderNum }: { orderNum: string }) => {
  try {
    if (isMock) {
      return orderDetailMockData
    } else {
      let { getOrder } = await ApiRoot.orders().getOrder({ storeId: '12345678', orderNum })
      console.info('res', getOrder)
      return getOrder
    }
  } catch (e) {
    console.log(e)
    return {}
  }
}

export const getExpressCompanyList = async () => {
  try {
    let expressCompanyList = session.get('express-company-list')
    if (!expressCompanyList) {
      let res = await ApiRoot.orders().getExpressCompany({ storeId: '12345678' })
      console.info('get expressCompany data view', res)
      expressCompanyList = res.expressCompanies || []
      session.set('express-company-list', expressCompanyList)
    }
    return expressCompanyList
  } catch (e) {
    console.log(e)
    return []
  }
}

export const shippedOrder = async (params: any) => {
  try {
    let { userInfo } = Taro.getStorageSync('wxLoginRes')
    params = Object.assign(params, {
      storeId: userInfo?.storeId || '12345678',
      operator: userInfo?.nickName || 'system',
    })
    console.info('shipped order view params', params)
    let res = await ApiRoot.orders().shippedOrder({ body: params })
    console.info('shipped order data view', res)
    return res.shippedOrder || false
  } catch (e) {
    console.log(e)
    return false
  }
}

export const completedOrder = async (params: any) => {
  try {
    let { userInfo } = Taro.getStorageSync('wxLoginRes')
    params = Object.assign(params, {
      storeId: userInfo?.storeId || '12345678',
      operator: userInfo?.nickName || 'system',
    })
    console.info('completed order view params', params)
    let res = await ApiRoot.orders().completedOrder({ body: params })
    console.info('completed order data view', res)
    return res.completedOrder || false
  } catch (e) {
    console.log(e)
    return false
  }
}

export const cancelOrder = async (params: any) => {
  try {
    let { userInfo } = Taro.getStorageSync('wxLoginRes')
    params = Object.assign(params, {
      storeId: userInfo?.storeId || '12345678',
      operator: userInfo?.nickName || 'system',
    })
    console.info('cancel order view params', params)
    let res = await ApiRoot.orders().cancelOrder({ body: params })
    console.info('cancel order data view', res)
    return res.cancelOrder || false
  } catch (e) {
    console.log(e)
    return false
  }
}
