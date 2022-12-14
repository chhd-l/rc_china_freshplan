import { View } from '@tarojs/components'

const TimeLine = ({
  type = 'UNPAID',
}: {
  type: 'UNPAID' | 'TO_SHIP' | 'SHIPPED' | 'COMPLETED' | 'VOID' | undefined
}) => {
  return (
    <View className="timeLine px-1 pb-1.5">
      <View className="line flex items-center mx-[1.5em]">
        <View
          className={`lineSpot rounded-full ${
            (type === 'TO_SHIP' || type === 'SHIPPED' || type === 'COMPLETED') && 'selectBackground'
          }`}
        >1</View>
        <View
          className={`HorizontalLine flex-1 ${
            (type === 'TO_SHIP' || type === 'SHIPPED' || type === 'COMPLETED') && 'selectBackground'
          }`}
        />
        <View
          className={`lineSpot rounded-full ${
            (type === 'SHIPPED' || type === 'COMPLETED') && 'selectBackground'
          }`}
        >2</View>
        <View
          className={`HorizontalLine flex-1 ${(type === 'SHIPPED' || type === 'COMPLETED') && 'selectBackground'}`}
        />
        <View className={`lineSpot rounded-full ${type === 'COMPLETED' && 'selectBackground'}`}>3</View>
      </View>
      <View className="flex items-center justify-between mt-1 text-[#999]">
        <View
          className={`${(type === 'TO_SHIP' || type === 'SHIPPED' || type === 'COMPLETED') && 'text-[#000] font-bold'}`}
        >
          买家付款
        </View>
        <View className={`${(type === 'SHIPPED' || type === 'COMPLETED') && 'text-[#000] font-bold'}`}>商家发货</View>
        <View className={`${type === 'COMPLETED' && 'text-[#000] font-bold'}`}>交易完成</View>
      </View>
    </View>
  )
}

export default TimeLine
