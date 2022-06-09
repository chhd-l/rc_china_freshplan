import { View, Image, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { formatMoney } from '@/utils/utils'
import { Order } from '@/framework/types/order'
import { normalizeTags } from '@/framework/api/lib/normalize'
import routers from '@/routers'
import IconFont from '@/iconfont'
import OrderAction from '../OrderAction'
import './index.less'

const orderStatusType = {
  UNPAID: '待付款',
  TO_SHIP: '待发货',
  SHIPPED: '待收货',
  COMPLETED: '已完成',
  VOID: '已取消',
}

const OrderListComponents = ({
  list,
  operationSuccess,
  openModalTip,
}: {
  list: Order[]
  operationSuccess: Function
  openModalTip: Function
}) => {
  const copyText = (orderNumber) => {
    Taro.setClipboardData({
      data: orderNumber,
    })
  }

  return (
    <ScrollView className="OrderListComponents" scrollY>
      {list.map((item: any, idx: number) => (
        <View
          className="card"
          key={idx}
          onClick={(e) => {
            e.stopPropagation()
            Taro.navigateTo({
              url: `${routers.orderDetail}?id=${item.orderNumber}`,
            })
          }}
        >
          <View
            className="h-6 flex justify-between items-center text-24 pb-2 mb-2"
            style={{ borderBottom: '1px solid rgb(232, 232, 232)' }}
          >
            <View className="flex items-center">
              {item?.isSubscription ? (
                <View className="mr-2">
                  <IconFont name="a-Group201" size={32} />
                </View>
              ) : null}
              订单编号: {item.orderNumber}
              <View
                className="ml-2 rounded-2xl text-22 px-2"
                style={{ background: '#e7e7e7' }}
                onClick={(e) => {
                  e.stopPropagation()
                  copyText(item.orderNumber)
                }}
              >
                复制
              </View>
            </View>
            <View className="text-primary-red">{orderStatusType[item?.tradeState?.orderState || '']}</View>
          </View>
          {(item?.lineItem?.filter((el) => !el.isGift) || []).map((el, index) => (
            <View key={index} className="w-full flex items-center max-h-20 " style={{ marginBottom: '36rpx' }}>
              <View className="w-32 h-full" style={{ marginTop: '36rpx' }}>
                {el?.pic ? (
                  <Image className="w-full h-full" mode="widthFix" src={el?.pic} />
                ) : (
                  <Image className="w-full h-20" mode="widthFix" src={el?.pic} />
                )}
              </View>
              <View className="w-full h-full flex flex-col pl-3">
                <View className="text-30 font-black mb-1">{el?.skuName}</View>
                <View className="text-primary-red flex text-20 justify-between items-center">
                  <View className="flex flex-row flex-wrap">
                    {normalizeTags(el.goodsAttributeAndValues, el.feedingDays).map((tag) => (
                      <View
                        className="px-1 border rounded-lg border-solid border-red mr-2"
                        style={{ marginTop: '1px' }}
                      >
                        {tag}
                      </View>
                    ))}
                  </View>
                  <View className="text-gray-400">X{el?.num}</View>
                </View>
                <View className="text-24 mt-2 items-end ProductIntroduction text-gray-400">
                  规格：{el?.goodsSpecifications}
                </View>
                {item.freshType === 'FRESH_100_DAYS' ? (
                  <View className="text-24 mt-1 items-end ProductIntroduction text-gray-400">新鲜度：100天</View>
                ) : null}
              </View>
            </View>
          ))}
          {item?.lineItem?.filter((el) => el.isGift)?.length ? (
            <View style={{ borderTop: '1rpx solid #e8e8e8', marginBottom: '18rpx' }} />
          ) : null}
          {(item?.lineItem?.filter((el) => el.isGift) || []).map((el, index) => (
            <View key={index} className="w-full flex items-center" style={{ marginBottom: '36rpx' }}>
              <View className="w-16 h-full" style={{ marginTop: '36rpx' }}>
                {el?.pic ? (
                  <Image className="w-full h-full" mode="widthFix" src={el?.pic} />
                ) : (
                  <Image className="w-full h-20" mode="widthFix" src={el?.pic} />
                )}
              </View>
              <View className="w-full h-full flex flex-col pl-3">
                <View className="text-30 font-black mb-1">
                  {el?.skuName}
                  <Text className="px-1 text-22 font-normal bg-primary-red text-white ml-1 whitespace-nowrap">
                    赠品
                  </Text>
                </View>
                <View className=" flex ProductIntroduction justify-between items-center">
                  <View className="text-gray-400 text-20">X{el?.num}</View>
                </View>
                {el?.goodsSpecifications ? (
                  <View className="text-24 mt-2 items-end ProductIntroduction text-gray-400">
                    规格：{el?.goodsSpecifications}
                  </View>
                ) : null}
              </View>
            </View>
          ))}
          <View className="w-full pt-2 footerText flex items-end flex-col">
            <View className="text-right text-22">
              共{item?.lineItem?.length}件商品 总价{formatMoney(item.tradePrice.goodsPrice)}，优惠
              {formatMoney(item.tradePrice.discountsPrice || 0)}，实付款
              <Text className="text-primary-red text-28">{formatMoney(item.tradePrice.totalPrice)}</Text>
            </View>
            <OrderAction
              amount={item.tradePrice.totalPrice * 100}
              // remark={item.remark}
              orderState={item?.tradeState?.orderState || ''}
              orderId={item.orderNumber || ''}
              operationSuccess={() => {
                operationSuccess && operationSuccess()
              }}
              openModalTip={() => {
                openModalTip && openModalTip()
              }}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

export default OrderListComponents
