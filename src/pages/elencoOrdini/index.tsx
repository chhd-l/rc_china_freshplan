import { View } from '@tarojs/components'
import { getCurrentInstance } from '@tarojs/taro'
import { useState } from 'react'
import { AtTabs, AtTabsPane } from 'taro-ui'
import './index.less'

const tabList = [{ title: '全部' }, { title: '待付款' }, { title: '待发货' }, { title: '待收货' }]

const OrderList = () => {
  const { router } = getCurrentInstance()

  const [current, setCurrent] = useState(Number(router?.params?.status) || 0)

  return (
    <View>
      <AtTabs current={current} tabList={tabList} onClick={(e) => setCurrent(e)} swipeable>
        {tabList.map((item, index) => (
          <AtTabsPane current={index} index={index} key={item.title}>
            <View>1111</View>
          </AtTabsPane>
        ))}
      </AtTabs>
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
