import OrderCard from '@/components/OrderCard'
import { getOrderList } from '@/framework/api/order'
import { Order } from '@/framework/types/order'
import { CDNIMGURL } from '@/lib/constants'
import { Image, Text, View } from '@tarojs/components'
import { getCurrentInstance, useReachBottom } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { AtSearchBar, AtTabs, AtTabsPane } from 'taro-ui'
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
  const [current, setCurrent] = useState(OrderStatusEnum[router?.params?.status || 0])
  const [orderList, setOrderList] = useState<Order[]>([])
  const [isNoMore, setIsNoMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  const getOrderLists = async ({ orderState = current, curPage = currentPage }) => {
    let records: any[] = []
    const limit = 10
    let offset = curPage ? curPage * limit : 0
    const res = await getOrderList({
      limit,
      offset,
      sample: orderState !== 'ALL' ? { orderState } : {},
    })
    setIsNoMore(res?.total < offset + 10)
    setOrderList(records.concat(res?.records))
  }

  const handleClick = (value) => {
    const cur = Object.values(OrderStatusEnum).filter((item) => item === value)[0]
    setCurrent(Object.keys(OrderStatusEnum)[cur])
    getOrderLists({ orderState: Object.keys(OrderStatusEnum)[cur] })
  }

  useReachBottom(() => {
    if (!isNoMore) {
      let page = currentPage + 1
      setCurrentPage(page)
      getOrderLists({ curPage: page })
    }
  })

  useEffect(() => {
    getOrderLists({ orderState: OrderStatusEnum[router?.params?.status || 0] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.params?.status])

  return (
    <View className="myOrderList pb-2">
      <View className="bg-white py-0.5">
        <AtSearchBar value="" onChange={() => null} />
      </View>
      <AtTabs current={OrderStatusEnum[current]} tabList={tabList} onClick={handleClick} swipeable>
        {tabList.map((item, index) => (
          <AtTabsPane current={OrderStatusEnum[current]} index={index} key={item.title}>
            {orderList.map((order, key) => (
              <OrderCard order={order} key={key} />
            ))}
          </AtTabsPane>
        ))}
      </AtTabs>
      {!orderList.length && (
        <View className="noOrders flex flex-col items-center justify-center mt-8">
          <Image className="noOrdersImage" src={`${CDNIMGURL}Empty%20orders.png`} />
          <View className="mt-2 flex justify-center">
            <Text className="ml-0.5">汪汪~啥也没有!</Text>
          </View>
        </View>
      )}
      {/* <AtModal
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
      /> */}
    </View>
  )
}

export default OrderList
