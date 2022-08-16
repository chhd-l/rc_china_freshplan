import PetTitle from '@/components/consumer/EditPet/components/PetTitle'
import { Text, View } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import './index.less'
import { freshFood_left, freshFood_right } from './index.modules'

const FreshFoodExperience = () => {
  return (
    <View>
      <View className="ml-[20px] mb-[70px] mt-[73px]">
        <PetTitle>
          <Text className="text-[48px]">我们专注为您的爱宠 提供营养健康的鲜食体验</Text>
        </PetTitle>
      </View>
      <View className="flex flex-col">
        <View className="freshFoodbg">用新鲜完整的食材制成</View>
        <View className="relative pt-[45px] flex flex-row ">
          <View className="flex flex-col  flex-1 ">
            {freshFood_left.map((item, key) => (
              <View className="flex flex-row mb-[55px] justify-start items-center" key={key}>
                <Text>icon</Text>
                <Text className="text-[#96CC39] text-[24px]">{item.text}</Text>
              </View>
            ))}
          </View>
          <View className="flex flex-col  flex-1 ">
            {freshFood_right.map((item, key) => (
              <View className="flex flex-row mb-[55px] justify-start items-center" key={key}>
                <Text>icon</Text>
                <Text className="text-[#96CC39] text-[24px]">{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className="w-full">
          <AtButton type="secondary" circle size="normal">
            查看饮食 {'>>'}
          </AtButton>
        </View>
      </View>
    </View>
  )
}

export default FreshFoodExperience
