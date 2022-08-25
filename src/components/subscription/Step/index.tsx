import PetTitle from '@/components/consumer/EditPet/components/PetTitle'
import { Image, Text, View } from '@tarojs/components'

const Step = () => {
  return (
    <View className="bg-white">
      <View className="ml-[20px] mb-[70px]">
        <PetTitle>
          <Text className="text-[48px]">仅三步即可开启鲜食计划</Text>
        </PetTitle>
      </View>
      <View className=" mx-[20px] h-h-28">
        <Image src="https://dtcdata.oss-cn-shanghai.aliyuncs.com/asset/image/step_line.png" />
      </View>
    </View>
  )
}

export default Step
