import { Image, Text, View } from '@tarojs/components'
import foodbg from '@/assets/img/foodbg.png'
import { AtButton, AtIcon } from 'taro-ui'
import './index.less'

const Formula = () => {
  return (
    <View className="mt-[65px] formula ">
      <View className="relative top-0 text-white z-10 pt-[21px] px-[32px] right-0 left-0 pb-[74px]">
        <View className="text-[60px] leading-[90px]">牛肉泥</View>
        <View className="text-[34px] leading-[40px] mt-[5px]">牛肉 土豆 鸡蛋 胡萝卜 豌豆</View>
        <View className="mt-[40px] mb-[37px] w-[320px]">
          <AtButton className=" rounded-full flex items-center" type="primary">
            <AtIcon className="mr-1" value="clock" size="26" />
            开始定制
          </AtButton>
        </View>
        <View className="text-[28px] font-bold mb-[20px]">卡路里含量</View>
        <View className="text-[#DDDDDD] text-[22px] mb-[28px] leading-[26px]">1479大卡/公斤，201大卡/杯ME</View>
        <View className="divide_la relative mb-[24px]" />
        <View className=" text-[28px] font-bold ">营养成分分析</View>
        <View className="flex flex-row mt-[20px] justify-between">
          <Text>粗蛋白质</Text>
          <Text>8%以上</Text>
        </View>
        <View className="flex flex-row mt-[20px] justify-between">
          <Text>粗脂肪</Text>
          <Text>4%以上</Text>
        </View>
        <View className="flex flex-row mt-[20px] justify-between">
          <Text>粗纤维</Text>
          <Text>最大1%</Text>
        </View>
        <View className="flex flex-row mt-[20px] justify-between">
          <Text>水分</Text>
          <Text>最大77%</Text>
        </View>
        <View className="divide_la relative my-[24px]" />
        <View className="text-[22px] leading-[26px]">
          配料：碎牛肉、赤褐色土豆、鸡蛋、胡萝卜、豌豆、磷酸二钙、氯化钾、盐、天然香料、柠檬酸、碳酸钙、牛磺酸、醋、鱼油、葵花籽油、酒石酸氢胆碱、加工用水量、铁氨基酸螯合物、葡萄糖酸锌、维生素
          E 补充剂、葡萄糖酸铜、烟酸（维生素 B3）、葡萄糖酸锰、维生素 A 补充剂、硫胺素（维生素 B1）、盐酸吡哆醇（维生素
          B6）、核黄素（维生素 B2）、胆钙化醇（来源维生素 D3)、碘化钾、叶酸、维生素 B12 补充剂。
        </View>
      </View>
      <Image src={foodbg} className="absolute z-0 top-0" />
    </View>
  )
}

export default Formula
