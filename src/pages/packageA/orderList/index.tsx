import Taro, { getCurrentInstance, useReachBottom } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { AtModal, AtTabs, AtTabsPane } from 'taro-ui'
import OrderListComponents from '@/components/order/OrderListComponents'
import { getOrderList } from '@/framework/api/order/order'
import { Order } from '@/framework/types/order'
import { View } from '@tarojs/components'
import routers from '@/routers'
import { cloneDeep } from 'lodash'
import './index.less'
import NavBar from '@/components/common/Navbar'

const tabList = [{ title: '全部' }, { title: '待付款' }, { title: '待发货' }, { title: '待收货' }]

const OrderStatusEnum = {
  ALL: 0,
  UNPAID: 1,
  TO_SHIP: 2,
  SHIPPED: 3,
}

const OrderList = () => {
  const [current, setCurrent] = useState('ALL')
  const [orderList, setOrderList] = useState<Order[]>([])
  const [showShipModal, setShowShipModal] = useState(false)
  const [showSendCouponModal, setShowSendCouponModal] = useState(false)
  const { router } = getCurrentInstance()
  const [isFromSubscription, setIsFromSubscription] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [isNoMore, setIsNoMore] = useState(false)

  useReachBottom(() => {
    if (!isNoMore) {
      let page = currentPage + 1
      setCurrentPage(page)
      getOrderLists({ curPage: page })
    }
  })

  const getOrderLists = async ({ status = '', curPage = currentPage }) => {
    let records: any[] = []
    if (status !== '') {
      curPage = 0
    } else {
      status = current
      records = cloneDeep(orderList)
    }
    let offset = curPage ? curPage * 10 : 0
    const customerInfo = Taro.getStorageSync('wxLoginRes').userInfo
    const res = await getOrderList({
      storeId: '12345678',
      operator: 'zz',
      limit: 10,
      offset,
      isNeedTotal: true,
      sample: Object.assign(
        {
          customerId: customerInfo.id,
        },
        status !== 'ALL' ? { orderState: status } : {},
      ),
    })
    console.log('order list data', res)
    if (res?.total < offset + 10) {
      setIsNoMore(true)
    } else {
      setIsNoMore(false)
    }
    setOrderList([...records, ...res?.records])
  }

  Taro.useDidShow(() => {
    const status = router?.params?.status || 'ALL'
    const isFromSubscriptionOrder = router?.params?.isFromSubscription
    console.log('status', isFromSubscription)
    console.log('isFromSubscription', isFromSubscriptionOrder)
    setIsFromSubscription(!!isFromSubscriptionOrder)
    setCurrent(status)
    getOrderLists({ status })
  })

  useEffect(() => {
    const isSendCoupon = router?.params?.isSendCoupon
    if (isSendCoupon) {
      setShowSendCouponModal(true)
    }
  }, [])

  const handleClick = async (value) => {
    await Taro.setNavigationBarTitle({
      title: tabList[value].title,
    })
    const cur = Object.values(OrderStatusEnum).filter((item) => item === value)[0]
    setCurrent(Object.keys(OrderStatusEnum)[cur])
    await getOrderLists({ status: Object.keys(OrderStatusEnum)[cur] })
  }
  console.info('showSendCouponModal', showSendCouponModal)
  return (
    <View>
      <NavBar navbarTitle={tabList[OrderStatusEnum[current]].title} isNeedBack />
      <AtTabs className="index" current={OrderStatusEnum[current]} tabList={tabList} onClick={handleClick} swipeable>
        {tabList.map((item, index) => (
          <AtTabsPane current={OrderStatusEnum[current]} index={index} key={item.title}>
            {orderList?.length > 0 ? (
              <OrderListComponents
                list={orderList}
                operationSuccess={async () => {
                  await getOrderLists({})
                }}
                openModalTip={() => {
                  setShowShipModal(true)
                }}
              />
            ) : null}
          </AtTabsPane>
        ))}
      </AtTabs>
      <AtModal
        key="orderShipTip"
        isOpened={showShipModal}
        title="提示"
        content="已提醒发货，请耐心等待"
        confirmText="确定"
        onClose={() => {
          setShowShipModal(false)
        }}
        onCancel={() => {
          setShowShipModal(false)
        }}
        onConfirm={() => {
          setShowShipModal(false)
        }}
        className="order-to-ship-modal"
      />
      <AtModal
        key="orderShipTip"
        isOpened={showSendCouponModal}
        title="温馨提示提示"
        content="您己获得相应线下门店服务券，请点击至我的卡包查看！"
        cancelText="取消"
        confirmText="确定"
        onClose={() => {
          setShowSendCouponModal(false)
        }}
        onCancel={() => {
          setShowSendCouponModal(false)
        }}
        onConfirm={() => {
          let url = `${routers.voucherList}?status=NOT_USED`
          Taro.navigateTo({
            url,
          })
          setShowSendCouponModal(false)
        }}
        className="order-to-ship-modal"
      />
    </View>
  )
}

export default OrderList
