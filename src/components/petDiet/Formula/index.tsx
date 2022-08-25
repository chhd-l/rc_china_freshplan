import { FormulaData } from '@/pages/packageA/petDiet/index.module'
import { Image, Text, View, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { useAtom } from 'jotai'
import { consumerAtom } from '@/store/consumer'
import { loginWithAlipay } from '@/components/consumer/AuthLogin/alipay-login'
import './index.less'

type FormulaProps = {
  data: FormulaData
}
const Formula = ({ data }: FormulaProps) => {
  const [consumer, setConsumer] = useAtom(consumerAtom)

  const handleLogin = (callback?: Function) => {
    if (consumer?.id) {
      callback && callback()
    } else {
      loginWithAlipay((data) => {
        setConsumer(data)
        callback && callback()
      })
    }
  }

  return (
    <View className="mt-[65px] formula ">
      <View className="relative top-0 text-white z-10 pt-[21px] px-[32px] right-0 left-0 pb-[74px]">
        <View className="text-[60px] leading-[90px]">{data.name}</View>
        <View className="text-[34px] leading-[40px] mt-[5px]">{data.Ingredients}</View>
        <View className="mt-[40px] mb-[37px] w-[320px]">
          {consumer?.id ? <Button 
            className=" rounded-full flex items-center bg-color-primary justify-center border-0"
            type="primary"
            onClick={() => {
              Taro.navigateTo({ url: '/pages/packageA/choosePet/index' })
            }}
          >
            <AtIcon
              className="mr-1"
              value="clock"
              size="26"
            />
            开始定制
          </Button> : <Button
            className=" rounded-full flex items-center bg-color-primary justify-center border-0"
            type="primary"
            openType="getAuthorize"
            scope="phoneNumber"
            onGetAuthorize={() => {
              handleLogin(() => {
                Taro.navigateTo({ url: '/pages/packageA/choosePet/index' })
              })
            }}
          >
            <AtIcon
              className="mr-1"
              value="clock"
              size="26"
            />
            开始定制
          </Button>}
        </View>
        <View className="text-[28px] font-bold mb-[20px]">卡路里含量</View>
        <View className="text-[#DDDDDD] text-[22px] mb-[28px] leading-[26px]">{data.calorie}</View>
        <View className="divide_la relative mb-[24px]" />
        <View className=" text-[28px] font-bold ">营养成分分析</View>
        <View className="flex flex-row mt-[20px] justify-between">
          <Text>粗蛋白质</Text>
          <Text>{data.crudeProtein}</Text>
        </View>
        <View className="flex flex-row mt-[20px] justify-between">
          <Text>粗脂肪</Text>
          <Text>{data.crudeFat}</Text>
        </View>
        <View className="flex flex-row mt-[20px] justify-between">
          <Text>粗纤维</Text>
          <Text>{data.coarseFiber}</Text>
        </View>
        <View className="flex flex-row mt-[20px] justify-between">
          <Text>水分</Text>
          <Text>{data.waterContent}</Text>
        </View>
        <View className="divide_la relative my-[24px]" />
        <View className="text-[22px] leading-[26px]">{data.mixedIngredients}</View>
      </View>
      <Image src={data.image} className="absolute z-0 top-0" />
    </View>
  )
}

export default Formula
