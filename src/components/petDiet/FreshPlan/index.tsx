import { Image, Text, View } from '@tarojs/components'
import fresh_icon from '@/assets/icons/fresh_icon.png'
import plan_icon from '@/assets/icons/plan_icon.png'
import wrong from '@/assets/icons/wrong.png'
import right from '@/assets/icons/right.png'

import '../Formula/index.less'
import { frshPlanList } from './index.modules'

const FreshPlan = () => {
  return (
    <View className="mt-[90px]">
      <View className="text-[64px] font-bold">Fresh Plan </View>
      <View className="flex flex-row justify-end mr-[30px]">
        <View className="w-[96px] h-[29px]">
          <Image src={fresh_icon} />
        </View>
        <Text className="text-[30px] leading-[30px] ml-[99px]">其他</Text>
      </View>
      <View className="flex flex-row justify-end mr-[30px]">
        <View className="w-[96px] h-[29px]">
          <Image src={plan_icon} />
        </View>
        <Text className="text-[30px] leading-[30px] ml-[99px]">品牌</Text>
      </View>
      <View className="line my-[25px]" />
      {frshPlanList.map((item, key) => (
        <View key={key}>
          <View className="flex flex-row justify-between">
            <View className="flex-[2] text-18px">{item.text}</View>
            <View className="flex flex-row flex-1 justify-between mr-[30px]">
              <View className="w-[37px] h-[26px]">
                <Image src={right} />
              </View>
              <View className="w-[26px] h-[26px] mr-[10px]">
                <Image src={wrong} />
              </View>
            </View>
          </View>
          <View className="line my-[25px]" />
        </View>
      ))}
    </View>
  )
}

export default FreshPlan
