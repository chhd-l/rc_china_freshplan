import { CDNIMGURL2 } from '@/lib/constants'
import { FormulaData } from '@/pages/packageA/petDiet/index.module'
import { Image, Text, View } from '@tarojs/components'

type FormulaProps = {
  data: FormulaData
}
const Formula = ({ data }: FormulaProps) => {
  return (
    <View className="mt-1 bg-white pl-[45px] pr-[35px] py-[50px] rounded-[30px]">
      <View
        className="h-[230px] relative pb-1"
        style={{
          borderBottom: '1px solid #999',
        }}
      >
        <View className="h-full flex flex-col justify-between">
          <View className="text-[36px] font-bold">{data.name}</View>
          <View className="text-[26px] text-[#666]">{data.Ingredients}</View>
          <View
            className="mr-[1rem] pr-[1.1rem] py-[18px] pl-[18px] text-[19px] grid grid-cols-4 gap-x-[16px] rounded-[16px]"
            style={{
              background:
                'linear-gradient(90deg, #96CC39 12.06%, rgba(150, 204, 57, 0.505208) 64.08%, rgba(150, 204, 57, 0) 96.7%)',
            }}
          >
            {data.Ingredientlist.map((strs, key) => (
              <Text className="flex flex-col justify-center" key={key}>
                {strs.map((str, index) => (
                  <Text key={index}>{str}</Text>
                ))}
              </Text>
            ))}
          </View>
        </View>
        <View className="absolute right-0 top-0 w-[230px] h-[230px] rounded-full">
          <Image style={{ height: '100%' }} src={CDNIMGURL2 + data.image} />
        </View>
      </View>
      <View className="py-1 text-[22px] text-[#666]">
        <Text className="text-[23px] font-bold text-[#000]">卡路里含量：</Text>
        {data.calorie}
      </View>
      <View className="text-[22px] text-[#666] leading-[30px]">
        <Text className="text-[23px] font-bold text-[#000]">配料：</Text>
        {data.mixedIngredients}
      </View>
    </View>
  )
}

export default Formula
