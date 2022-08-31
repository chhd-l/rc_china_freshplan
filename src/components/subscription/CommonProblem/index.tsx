import PetTitle from '@/components/consumer/EditPet/components/PetTitle'
import { CDNIMGURL2 } from '@/lib/constants'
import { Image, Text, View } from '@tarojs/components'
import '../LovePetHealth/index.less'
import { commonProblems } from './index.modules'

const CommonProblem = () => {
  return (
    <View>
      <View className="ml-[20px]">
        <PetTitle>
          <Text className="text-[48px]">常见问题为您提供解答</Text>
        </PetTitle>
      </View>
      {commonProblems.map((item, key) => (
        <View key={key} className="bg-[#FAFAFA] border-[16px] mb-[22px] p-[26px] flex flex-col rounded-[16px]">
          <View className="flex flex-row items-center pl-[8px]">
            <View className="w-[50px] h-[50px] flex-shrink-0 -mr-[10px]" style={{ zIndex: 2 }}>
              <Image src={CDNIMGURL2 + 'Group 363.png'} />
            </View>
            <View
              className="text-[28px] font-bold leading-[45px] h-[45px] pl-[20px]"
              style={{
                background: 'linear-gradient(90deg, #DFEEC5 43.66%, rgba(233, 242, 218, 0) 100%)',
                zIndex: 1,
              }}
            >
              {item.question}
            </View>
          </View>
          <View />
          <View className="flex flex-row items-start pt-[21px]">
            <View className="w-[50px] h-[50px] mr-[18px] flex-shrink-0" />
            <View className="text-[26px] leading-[30px]">{item.answer}</View>
          </View>
        </View>
      ))}
    </View>
  )
}

export default CommonProblem
