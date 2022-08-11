import { View } from '@tarojs/components'

const TimeLine = () => {
  return (
    <View className="timeLine mx-2 py-1">
      <View className="flex items-center justify-between mb-1">
        <View>买家付款</View>
        <View>商家发货</View>
        <View>交易完成</View>
      </View>
      <View className="line flex items-center">
        <View className="lineSpot mr-0.5" />
        <View className="HorizontalLine flex-1" />
        <View className="lineSpot mx-0.5" />
        <View className="HorizontalLine flex-1" />
        <View className="lineSpot ml-0.5" />
      </View>
    </View>
  )
}

export default TimeLine
