import routers from '@/routers'
import Taro from '@tarojs/taro'
import apis from '@/framework/config/api-config'
import ApiRoot from '../fetcher'

interface PayInput {
  consumerId: string
  consumerOpenId: string
  orderId: string
  orderNo: string
  orderDescription: string
  payWayId: string
  amount: number
  currency: string
  storeId: string
  operator?: string
}

export const pay = async ({ params, success, fail, paymentRequest }: { params: PayInput; success?: Function; fail?: Function; paymentRequest?: any }) => {
  try {
    // 订单发货提醒
    // 订单待支付提醒
    // @ts-ignore
    Taro.requestSubscribeMessage({
      // @ts-ignore
      tmplIds: [deliverGoodsTemplateId, toBePaidTemplateId],
      success: async (res) => {
        console.info('============')
        // @ts-ignore
        if (res[deliverGoodsTemplateId] && res[toBePaidTemplateId]) {
          let paymentId = '', timeStamp = '', nonceStr = '', packageStr = '', signType: any = '', paySign = '', payment: any = {}
          if (paymentRequest?.isSuccess) {
            payment = paymentRequest.payment
            console.info('.....paymentRequest,isSubscription', paymentRequest)
            timeStamp = paymentRequest.wxPaymentRequest.timeStamp
            nonceStr = paymentRequest.wxPaymentRequest.nonceStr
            packageStr = paymentRequest.wxPaymentRequest.package
            signType = paymentRequest.wxPaymentRequest.signType
            paySign = paymentRequest.wxPaymentRequest.paySign
            paymentId = paymentRequest.payment.id
          } else {
            console.info('........', payment)
            console.info('paramsparamsparams', params)
            const data = await ApiRoot({ url: apis?.payment }).payments().pay({ body: params })
            console.info('data', data)
            payment = data.payment
            const wxPaymentRequest = data.wxPaymentRequest
            if (data.isSuccess && wxPaymentRequest) {
              timeStamp = wxPaymentRequest.timeStamp
              nonceStr = wxPaymentRequest.nonceStr
              packageStr = wxPaymentRequest.package
              signType = wxPaymentRequest.signType
              paySign = wxPaymentRequest.paySign
              paymentId = payment.id
              console.info('.....notSubscription', wxPaymentRequest)
            }
          }
          console.info('payment', payment)
          if (payment?.status === 'PAID') {
            //0元就不用调用支付接口
            Taro.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(() => {
              let url = `${routers.orderList}?status=TO_SHIP`
              Taro.redirectTo({
                url,
              })
            }, 1000)
            return
          }
          if (timeStamp) {
            Taro.requestPayment({
              // 时间戳
              timeStamp,
              // 随机字符串
              nonceStr,
              // 统一下单接口返回的 prepay_id 参数值
              package: packageStr,
              // 签名类型
              signType,
              // 签名
              paySign,
              // 调用成功回调
              async success() {
                await ApiRoot({ url: apis?.payment }).payments().syncOrder({
                  input: {
                    paymentId: paymentId,
                    storeId: '12345678',
                  },
                })
                Taro.showLoading({
                  title: '支付成功',
                })
                success && success()
              },
              // 失败回调
              fail() {
                fail && fail()
              },
              // 接口调用结束回调
              complete() { },
            })
          }
        }
      },
      fail: (res) => {
        console.log(res)
      },
    })
  } catch (e) {
    console.log(e)
  }
}

export const payByAlipay = async (param: PayInput) => {
  try {
    const data = await ApiRoot({ url: apis?.payment }).payments().pay({ body: param });
    const wxLoginRes = Taro.getStorageSync("wxLoginRes");
    const aliPaymentReq = data?.aliPaymentRequest;
    const paymentObj = data?.payment;
    if (data?.isSuccess) {
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
          Taro.redirectTo({
            url: `${routers.orderList}?status=ALL&isFromSubscription=true`,
          })
        },
        fail: (res) => {
          console.log(res);
          Taro.redirectTo({
            url: `${routers.orderList}?status=UNPAID&isFromSubscription=true`,
          })
        }
      });
    }
  } catch (e) {
    Taro.showToast({ title: '系统繁忙，请稍后再试' });
  }
}

export const payFromOrder = async (order: any) => {
  const wxLoginRes = Taro.getStorageSync("wxLoginRes");
  const paymentParam: PayInput = {
    consumerId: order?.consumer?.consumerId,
    consumerOpenId: order?.consumer?.openId,
    orderId: order?._id,
    orderNo: order?.orderNumber,
    orderDescription: '订单支付',
    payWayId: 'e47dfb0f-1d3f-11ed-8ae8-00163e02a658',
    amount: order?.orderPrice?.totalPrice * 100,
    currency: 'CNY',
    storeId: wxLoginRes?.userInfo?.storeId,
  };
  await payByAlipay(paymentParam);
}
