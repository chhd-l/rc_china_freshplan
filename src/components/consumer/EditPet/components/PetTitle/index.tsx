import { View, Text } from '@tarojs/components'

const PetTitle = (props: any) => {
  return (
    <View className="text-32 font-bold flex flex-col items-center justify-center">
      <View className="text-center">{props.children}</View>
      <Text className="bg-[#96CC39] w-[133px] h-[9px] mt-[29px]" />
    </View>
  )
}

export default PetTitle
