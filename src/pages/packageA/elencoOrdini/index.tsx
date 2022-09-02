import OrderCard from '@/components/OrderCard'
import { cancelOrder, completedOrder, deleteOrder, getOrderList } from '@/framework/api/order'
import { Order } from '@/framework/types/order'
import { CDNIMGURL, CDNIMGURL2 } from '@/lib/constants'
import { Image, Text, View } from '@tarojs/components'
import Taro, { getCurrentInstance, useReachBottom } from '@tarojs/taro'
import { useState } from 'react'
import { AtButton, AtIcon, AtSearchBar, AtTabs, AtTabsPane } from 'taro-ui'
import './index.less'

const tabList = [{ title: '全部' }, { title: '待付款' }, { title: '待发货' }, { title: '待收货' }]

const OrderStatusEnum = {
  ALL: 0,
  UNPAID: 1,
  TO_SHIP: 2,
  SHIPPED: 3,
}

const OrderList = () => {
  const { router } = getCurrentInstance()
  const [current, setCurrent] = useState(router?.params?.status || 'ALL')
  const [orderList, setOrderList] = useState<Order[]>([])
  const [isNoMore, setIsNoMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [curActionOrderId, setCurActionOrderId] = useState('')
  const [curActionType, setCurActionType] = useState('')
  const [showActionTipModal, setShowActionTipModal] = useState(false)
  const [searchOrder, setSearchOrder] = useState({
    fieldName: 'orderNoOrProductName',
    fieldValue: '',
  })
  const [loading, setLoading] = useState<boolean>(true)

  const getOrderLists = async ({
    orderState = current,
    curPage = currentPage,
    queryParameters,
    list = [],
  }: {
    orderState?: string
    curPage?: number
    queryParameters?: any
    list?: any[]
  }) => {
    const limit = 10
    let offset = curPage ? curPage * limit : 0
    setLoading(true)
    const res = await getOrderList({
      limit,
      offset,
      sample:
        orderState !== 'ALL'
          ? queryParameters?.fieldValue
            ? { orderState, queryParameters }
            : { orderState }
          : queryParameters?.fieldValue
          ? { queryParameters }
          : {},
    })
    setIsNoMore(res?.total <= offset + 10)
    setOrderList(list.concat(res?.records))
    setLoading(false)
  }

  useReachBottom(() => {
    if (!isNoMore) {
      let page = currentPage + 1
      setCurrentPage(page)
      getOrderLists({ curPage: page, list: orderList })
    }
  })

  const handleClick = (value) => {
    const cur = Object.values(OrderStatusEnum).filter((item) => item === value)[0]
    setCurrent(Object.keys(OrderStatusEnum)[cur])
    getOrderLists({ orderState: Object.keys(OrderStatusEnum)[cur] })
  }

  const orderButton = (id, type) => {
    setCurActionOrderId(id)
    setCurActionType(type)
    setShowActionTipModal(true)
  }

  const returnText = () => {
    switch (curActionType) {
      case 'UNPAID':
        return '确定要取消该订单吗？'
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

  const cancal = async () => {
    let res = await cancelOrder({
      orderNum: curActionOrderId,
      nowOrderState: curActionType,
    })
    setShowActionTipModal(false)
    if (res) {
      getOrderLists({ orderState: current })
    }
  }

  //确认收货
  const completed = async () => {
    const res = await completedOrder({
      orderNum: curActionOrderId,
      nowOrderState: curActionType,
    })
    setShowActionTipModal(false)
    if (res) {
      getOrderLists({ orderState: current })
    }
  }
  //删除订单
  const deleteOrders = async () => {
    let res = await deleteOrder(curActionOrderId)
    setShowActionTipModal(false)
    if (res) {
      getOrderLists({ orderState: current })
    }
  }

  const handleClickActionTipModal = async () => {
    setShowActionTipModal(false)
    switch (curActionType) {
      case 'UNPAID':
        await cancal()
        break
      case 'TO_SHIP':
        setShowActionTipModal(false)
        break
      case 'SHIPPED':
        await completed()
        break
      case 'VOID':
        await deleteOrders()
        break
    }
  }

  Taro.useDidShow(() => {
    getOrderLists({ orderState: router?.params?.status })
  })

  return (
    <View className="myOrderList pb-2">
      <View className="bg-white py-0.5">
        <AtSearchBar
          value={searchOrder.fieldValue}
          placeholder="搜索订单"
          onChange={(e) =>
            setSearchOrder({
              fieldName: 'orderNoOrProductName',
              fieldValue: e,
            })
          }
          onClear={() => {
            setSearchOrder({
              fieldName: 'orderNoOrProductName',
              fieldValue: '',
            })
            getOrderLists({
              orderState: current,
              curPage: currentPage,
              queryParameters: {
                fieldName: 'orderNoOrProductName',
                fieldValue: '',
              },
            })
          }}
          onActionClick={() => {
            getOrderLists({ orderState: current, curPage: currentPage, queryParameters: searchOrder })
          }}
        />
      </View>
      <AtTabs current={OrderStatusEnum[current]} tabList={tabList} onClick={handleClick} swipeable>
        {tabList.map((item, index) => (
          <AtTabsPane current={OrderStatusEnum[current]} index={index} key={item.title}>
            {orderList.map((order, key) => (
              <OrderCard orderButton={orderButton} order={order} key={key} />
            ))}
          </AtTabsPane>
        ))}
      </AtTabs>
      {isNoMore && !!orderList.length && (
        <View className="text-center text-[26px] text-[#666] mt-[10px] mb-[50px]">没有更多了~</View>
      )}
      {!loading && !orderList.length && (
        <View className={`noOrders flex flex-col items-center justify-center ${current === 'ALL' ? 'mt-4' : 'mt-8'}`}>
          <Image className="noOrdersImage" src={`${CDNIMGURL2}image 43.png`} />
          <View className="mt-1 flex justify-center">
            <Text className="ml-0.5 text-[#666]">啥也没有~</Text>
          </View>
          {current === 'ALL' && (
            <AtButton
              type="primary"
              className="rounded-full startCustomizing mt-[86px]"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              定制鲜粮
            </AtButton>
          )}
        </View>
      )}

      {/* 弹出层 */}
      <View
        className="pop-modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center"
        style={{
          display: showActionTipModal ? 'flex' : 'none',
        }}
        onClick={(e) => {
          e.stopPropagation()
          setShowActionTipModal(false)
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
            <View className="text-[29px] text-[#333] mt-2">{returnText()}</View>
            <View className="flex items-center justify-between my-2">
              <AtButton
                circle
                className="w-[190px] h-[80px] leading-[80px] text-[24px] text-white m-0 border-0 bg-[#C8E399]"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowActionTipModal(false)
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
    </View>
  )
}

export default OrderList
