import fresh_icon from '@/assets/icons/fresh_icon.png'
import plan_icon from '@/assets/icons/plan_icon.png'
import right from '@/assets/icons/right.png'
import wrong from '@/assets/icons/wrong.png'
import { Image, Text, View } from '@tarojs/components'
import '../Formula/index.less'
import './index.less'
import { freshPlanList } from './index.modules'

const FreshPlan = () => {
  // const [status] = useState<'more' | 'loading' | 'noMore' | undefined>('more')
  return (
    <View className="py-[41px] fresh bg-[#EEE] mx-[-30px] px-[30px]">
      <View className="text-[64px] font-bold mb-[35px]">Fresh Plan的优势</View>
      <View className="flex flex-row justify-end mr-[30px]">
        <View className="w-[96px] h-[29px]">
          <Image src={fresh_icon} />
        </View>
        <Text className="text-[30px] leading-[30px] ml-[99px]">其他</Text>
      </View>
      <View className="flex flex-row justify-end mr-[30px] mb-[23px]">
        <View className="w-[96px] h-[29px]">
          <Image src={plan_icon} />
        </View>
        <Text className="text-[30px] leading-[30px] ml-[99px]">品牌</Text>
      </View>
      {freshPlanList.map((item, key) => (
        <View key={key}>
          <View className="line " />
          <View className="flex flex-row justify-between my-[34px] ">
            <View className="flex-[2] text-[18px]">{item.text}</View>
            <View className="flex flex-row flex-1 justify-between mr-[30px]">
              <View className="w-[37px] h-[26px]">
                <Image src={right} />
              </View>
              <View className="w-[26px] h-[26px] mr-[10px]">
                <Image src={wrong} />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}

export default FreshPlan
