import PetTitle from '@/components/consumer/EditPet/components/PetTitle'
import { Image, Text, View } from '@tarojs/components'
import './index.less'

const Step = () => {
  return (
    <View className="bg-white">
      <View className="flex justify-center">
        <Text className="rcciconfont rccicon-down IconDownAnimo" />
      </View>
      <View className="ml-[20px]">
        <PetTitle>
          <Text className="text-[48px]">仅三步即可开启鲜食计划</Text>
        </PetTitle>
      </View>
      <View className=" mx-[20px] h-h-28">
        <Image src="https://dtcdata.oss-cn-shanghai.aliyuncs.com/asset/image/steps.png" />
      </View>
    </View>
  )
}

export default Step
