import { View, Text } from '@tarojs/components'
import './index.less'

const PetTitle = (props: any) => {
  return (
    <View className="pet-title relative text-32 font-bold mb-[30px] mt-[75px]">
      <Text className="anchor absolute" />
      <View className="ml-21px">{props.children}</View>
    </View>
  )
}

export default PetTitle
