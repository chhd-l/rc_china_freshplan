import PetTitle from '@/components/consumer/EditPet/components/PetTitle'
import { Image, Text, View } from '@tarojs/components'
import step_line from '../../../assets/img/step_line.png'

const Step = () => {
  return (
    <View>
      <View className="ml-[20px] mb-[70px]">
        <PetTitle>
          <Text className="text-[48px]">仅三步即可开启鲜食计划</Text>
        </PetTitle>
      </View>
      <View className=" mx-[20px] h-h-28">
        <Image src={step_line} />
      </View>
    </View>
  )
}

export default Step
