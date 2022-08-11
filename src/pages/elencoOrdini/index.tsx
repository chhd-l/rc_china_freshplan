import OrderCard from '@/components/OrderCard'
import { CDNIMGURL } from '@/lib/constants'
import { Image, Text, View } from '@tarojs/components'
import { getCurrentInstance } from '@tarojs/taro'
import { useState } from 'react'
import { AtSearchBar, AtTabs, AtTabsPane } from 'taro-ui'
import './index.less'

const tabList = [{ title: '全部' }, { title: '待付款' }, { title: '待发货' }, { title: '待收货' }]

const OrderList = () => {
  const { router } = getCurrentInstance()

  const [current, setCurrent] = useState(Number(router?.params?.status) || 0)

  return (
    <View className="myOrderList pb-2">
      <View className="bg-white py-0.5">
        <AtSearchBar value="" onChange={() => null} />
      </View>
      <AtTabs current={current} tabList={tabList} onClick={(e) => setCurrent(e)} swipeable>
        {tabList.map((item, index) => (
          <AtTabsPane current={index} index={index} key={item.title}>
            <OrderCard />
          </AtTabsPane>
        ))}
      </AtTabs>
      <View className="noOrders flex flex-col items-center justify-center mt-8">
        <Image className="noOrdersImage" src={`${CDNIMGURL}Empty%20orders.png`} />
        <View className="mt-2 flex justify-center">
          <Text className="ml-0.5">汪汪~啥也没有!</Text>
        </View>
      </View>
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
