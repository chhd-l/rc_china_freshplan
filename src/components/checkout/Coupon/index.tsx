import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtModal } from 'taro-ui'
import { useState } from 'react'
import { VOUCHER_ORDER_ICON } from '@/lib/constants'

const Coupon = () => {
  const [showNoCoupon, setShowNoCoupon] = useState(false)

  const selectCoupon = () => {
    setShowNoCoupon(true)
  }

  return (
    <View className="bg-white mt-2 pl-2 py-2 rounded ">
      <View className="flex flex-row justify-between items-center">
        <View className="text-30 flex flex-row items-center">
          <Image className="w-6 h-6 mr-2" src={VOUCHER_ORDER_ICON} />
          优惠券
        </View>
        <View>
          <View>
            <Text className="text-xs text-gray-400">无</Text>
            <AtIcon value="chevron-right" size="24" onClick={selectCoupon} color='#666666'/>
          </View>
        </View>
      </View>
      <AtModal
        isOpened={showNoCoupon}
        title="提示"
        confirmText="确定"
        content="无可用优惠券"
        onClose={() => {
          setShowNoCoupon(false)
        }}
        onConfirm={() => setShowNoCoupon(false)}
      />
    </View>
  )
}
export default Coupon
