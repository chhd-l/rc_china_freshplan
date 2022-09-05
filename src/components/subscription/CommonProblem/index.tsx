import PetTitle from '@/components/consumer/EditPet/components/PetTitle'
import { CDNIMGURL2 } from '@/lib/constants'
import { Image, Text, View } from '@tarojs/components'
import '../LovePetHealth/index.less'
import { commonProblems } from './index.modules'

const CommonProblem = () => {
  return (
    <View className="mb-[30px]">
      <View className="mt-[76px] mb-[60px]">
        <PetTitle>
          <Text className="text-[48px]">常见问题为您提供解答</Text>
        </PetTitle>
      </View>
      {commonProblems.map((item, key) => (
        <View
          key={key}
          className="bg-[#FAFAFA] border-[16px] mb-[26px] p-[26px] flex flex-col rounded-[30px] mx-[0.2rem] overflow-hidden"
          style={{
            boxShadow: '6px 6px 22px -8px #d4d1d1',
          }}
        >
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
            <View className="text-[26px] leading-[30px] text-[#6D6D6D]">{item.answer}</View>
          </View>
        </View>
      ))}
    </View>
  )
}

export default CommonProblem
