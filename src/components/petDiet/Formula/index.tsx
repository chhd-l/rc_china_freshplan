import { loginWithAlipay } from '@/components/consumer/AuthLogin/alipay-login'
import { Consumer } from '@/framework/types/consumer'
import { CDNIMGURL2 } from '@/lib/constants'
import { FormulaData } from '@/pages/packageA/petDiet/index.module'
import { consumerAtom } from '@/store/consumer'
import { Button, Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAtom } from 'jotai'
import { AtIcon } from 'taro-ui'
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
      loginWithAlipay((datas: Consumer | ((prev: Consumer | null) => Consumer | null) | null) => {
        setConsumer(datas)
        callback && callback()
      })
    }
  }

  const Ingredientlist = (ingredient, span) => {
    return (
      <View className="flex flex-col text-white text-[23px] bg-[#D49D28] w-[158px] h-[158px] rounded-[16px] overflow-hidden">
        <Text className="flex-1 flex items-center justify-end text-[40px]">
          <View className="flex items-end">
            <Text className="text-[90px] font-black tracking-tighter">{ingredient}</Text>
            <Text className="mb-[5px] ml-[2px] text-[30px] mr-[10px]">%</Text>
          </View>
        </Text>
        <Text
          className="py-[10px] text-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, .5)',
          }}
        >
          {span}
        </Text>
      </View>
    )
  }

  return (
    <View className="mt-1 formula bg-white px-1 pt-1 pb-[55px] rounded-[16px]">
      <View className="flex items-center p-1 bg-[#F6F6F7] rounded-[8px]">
        <Image
          src={CDNIMGURL2 + data.image}
          className="mr-1"
          style={{
            width: '2.3rem',
            height: '2.3rem',
          }}
        />
        <View className="flex-1 flex flex-col">
          <Text className="text-[36px] font-bold leading-[42px]">{data.name}</Text>
          <Text className="mt-[11px] text-[30px] leading-[35px]">{data.Ingredients}</Text>
        </View>
      </View>
      <View
        className="flex py-[43px]"
        style={{
          borderBottom: '1px solid #E2E2E2',
        }}
      >
        {Ingredientlist(data.crudeProtein, '优质动物蛋白')}
        <View className="text-[#666] text-[22px] h-full ml-[31px] flex flex-col justify-between h-[158px] flex-1">
          <View>
            <Text className="text-[23px] text-[#000] font-bold">卡路里含量:</Text>
            {data.calorie}
          </View>
          <Text className="text-[23px] text-[#000] font-bold">营养成分分析:</Text>
          {/* <View className="grid grid-cols-2 gap-0.5 tracking-tighter"> */}
          <View className="flex items-center justify-between flex-wrap tracking-tighter">
            {data.Ingredientlist.map((str, key) => (
              <Text className={`w-[50%] ${key > 1 && 'mt-[10px]'}`} key={key}>
                {str}
              </Text>
            ))}
          </View>
        </View>
      </View>
      <View className="py-[43px]">
        <View className="pr-[31px] float-left">{Ingredientlist(data.crudeFat, '去汤含肉量')}</View>
        <View className="text-[22px] leading-[30px]">
          <Text className="text-[23px] text-[#000] font-bold">配料：</Text>
          <Text className="text-[#666]">{data.mixedIngredients}</Text>
        </View>
      </View>
      <Button
        className="rounded-full flex items-center bg-color-primary justify-center border-0"
        type="primary"
        openType="getAuthorize"
        scope="phoneNumber"
        onGetAuthorize={() => {
          handleLogin(() => {
            Taro.navigateTo({ url: '/pages/packageA/petEdit/index' })
          })
        }}
      >
        <AtIcon className="mr-1" value="clock" size="26" />
        开始定制
      </Button>
    </View>
  )
}

export default Formula
