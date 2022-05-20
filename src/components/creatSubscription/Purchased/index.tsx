import { petInfoAtom } from "@/store/subscription"
import { View, Text } from "@tarojs/components"
import { useAtom } from "jotai"
import CountTag from "../components/CountTag"
import './index.less'


const Purchased = () => {
  const [petInfo] = useAtom(petInfoAtom)


  return <View className="m-4">
    <View className="font-bold text-base ">您已购买</View>
    <View className="borderLine" />
    <View className="h-45 w-full flex flex-row my-4">
      <View className="bg-primary-red w-38 mr-2 relative" >
        <CountTag count={10} />
      </View>
      <View className="flex-1 h-30 pt-15">
        <View className="font-bold text-rc26 text-rc222222">皇家 英国短毛猫成猫全价粮</View>
        <View className="bg-rc_9B9C9D text-rcFFFFFF text-rc18 w-20 text-center my-2">逐包随单发货</View>
        <View className="text-rc22 textGray mt-2">适用年龄：1-7岁</View>
        <View className="text-rc22 textGray">建议天数</View>
        <View className="flex flex-row items-center justify-between">
          <View className="my-2">
            <Text className="text-rc20 text-primary-red">￥</Text>
            <Text className="font-bold text-primary-red text-rc28">173</Text>
            <Text className="text-primary-red text-rc20">.00</Text>
          </View>
          <View className="textGray text-rc22">x3</View>
        </View>
      </View>
    </View>
    <View className="flex flex-row">
      <View className="w-rc190 h-rc190 bg-primary-red mr-2 relative">
        <CountTag count={10} />
      </View>
      <View className="flex-1">
        <View className="font-bold text-rc26 text-rc222222">皇家 猫粮混粮随机口味</View>
        <View>
          <View className='at-icon at-icon-settings bg-primary-red rounded-sm text-white title h-4 leading-4 mr-2'>赠品</View>
          <Text className="text-white bg-gray-500 w-26 text-rc18 rounded-sm h-4 leading-4">逐包随单发货</Text>
        </View>
        <View className="textGray text-rc22 my-1">
          <Text className="  mt-2">适用年龄:</Text>
          <Text>0</Text>
        </View>
        <View className="flex justify-between">
          <View className="text-primary-red">
            <Text className="text-rc20 text-primary-red">￥</Text>
            <Text className="text-rc28">0</Text>
            <Text className="text-rc20">.00</Text>
          </View>
          <View className="textGray text-rc22">x3</View>
        </View>
      </View>
    </View>
    <View className="mt-8 flex flex-row justify-end items-center">
      <Text className="line-through text-rc222222 leading-16 text-rc22">原价￥{petInfo.originalPrice}，套餐折后价</Text>
      <Text className="text-primary-red font-bold text-64 mr-4 ml-2">￥{petInfo.discountPrice}</Text>
    </View>
  </View>
}

export default Purchased