import { View, Text } from '@tarojs/components'
import './index.less'

const PetTitle = (props: any) => {
  return (
    <View className="pet-title relative text-28 font-bold">
      <Text className="anchor absolute" />
      <View className="ml-21px">{props.children}</View>
    </View>
  )
}

export default PetTitle
