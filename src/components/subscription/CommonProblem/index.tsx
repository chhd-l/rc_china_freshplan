import PetTitle from '@/components/consumer/EditPet/components/PetTitle'
import { Image, Text, View } from '@tarojs/components'
import A_icon from '@/assets/icons/petHealth/answer.png'
import Q_icon from '@/assets/icons/petHealth/question.png'
import { commonProblems } from './index.modules'
import '../LovePetHealth/index.less'

const CommonProblem = () => {
  return (
    <View>
      <View className="ml-[20px]">
        <PetTitle>
          <Text className="text-[48px]">常见问题为您提供解答</Text>
        </PetTitle>
      </View>
      {commonProblems.map((item, key) => (
        <View key={key} className="shadow mb-[22px] p-[28px] flex flex-col">
          <View className="flex flex-row items-center h-[75px]">
            <View className="w-[50px] h-[50px] mr-[25px] flex-shrink-0">
              <Image src={Q_icon} />
            </View>
            <View className="text-[24px]  font-bold divide h-full leading-[75px]">{item.question}</View>
          </View>
          <View />
          <View className="flex flex-row items-start pt-[21px]">
            <View className="w-[50px] h-[50px] mr-[25px] flex-shrink-0">
              <Image src={A_icon} />
            </View>
            <View className="text-[24px] leading-[28px]">{item.answer}</View>
          </View>
        </View>
      ))}
    </View>
  )
}

export default CommonProblem
