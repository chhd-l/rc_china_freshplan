import { View } from '@tarojs/components'

const TimeLine = ({
  type = 'UNPAID',
}: {
  type: 'UNPAID' | 'TO_SHIP' | 'SHIPPED' | 'COMPLETED' | 'VOID' | undefined
}) => {
  return (
    <View className="timeLine px-2 pb-1.5">
      <View className="line flex items-center">
        <View
          className={`lineSpot rounded-full mr-0.5 ${
            (type === 'TO_SHIP' || type === 'SHIPPED' || type === 'COMPLETED') && 'selectBackground'
          }`}
        />
        <View
          className={`HorizontalLine flex-1 ${
            (type === 'TO_SHIP' || type === 'SHIPPED' || type === 'COMPLETED') && 'selectBackground'
          }`}
        />
        <View
          className={`lineSpot rounded-full mx-0.5 ${
            (type === 'SHIPPED' || type === 'COMPLETED') && 'selectBackground'
          }`}
        />
        <View
          className={`HorizontalLine flex-1 ${(type === 'SHIPPED' || type === 'COMPLETED') && 'selectBackground'}`}
        />
        <View className={`lineSpot rounded-full ml-0.5 ${type === 'COMPLETED' && 'selectBackground'}`} />
      </View>
      <View className="flex items-center justify-between mt-1">
        <View className={`${(type === 'TO_SHIP' || type === 'SHIPPED' || type === 'COMPLETED') && 'selectedWord'}`}>
          买家付款
        </View>
        <View className={`${(type === 'SHIPPED' || type === 'COMPLETED') && 'selectedWord'}`}>商家发货</View>
        <View className={`${type === 'COMPLETED' && 'selectedWord'}`}>交易完成</View>
      </View>
    </View>
  )
}

export default TimeLine
