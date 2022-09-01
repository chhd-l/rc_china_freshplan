import PetTitle from '@/components/consumer/EditPet/components/PetTitle'
import { Image, Text, View } from '@tarojs/components'
import './index.less'

const Step = () => {
  return (
    <View>
      <View className="flex justify-center mt-[44px] mb-[55px]">
        <Text className="rcciconfont rccicon-down IconDownAnimo text-[#fff] font-normal" />
      </View>
      <View className="p-[52px] rounded-[30px] bg-white">
        <View className="mb-[64px]">
          <PetTitle>
            <Text className="text-[48px]">仅三步即可开启鲜食计划</Text>
          </PetTitle>
        </View>
        <View className="mx-[20px] h-[590px]">
          <Image src="https://dtc-platform.oss-cn-shanghai.aliyuncs.com/static/steps.png" />
        </View>
      </View>
    </View>
  )
}

export default Step
