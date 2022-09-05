import { loginWithAlipay } from '@/components/consumer/AuthLogin/alipay-login'
import Formula from '@/components/petDiet/Formula'
import FreshPlan from '@/components/petDiet/FreshPlan'
import { Consumer } from '@/framework/types/consumer'
import { consumerAtom } from '@/store/consumer'
import { Button, Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { AtIcon } from 'taro-ui'
import { formulaData } from './index.module'

const PetDiet = () => {
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

  useEffect(() => {
    my.setNavigationBar({ image: 'https://dtcdata.oss-cn-shanghai.aliyuncs.com/asset/image/fresh-plan-logo.png' })
  }, [])

  return (
    <View>
      <View className="w-full h-[8rem]">
        <Image
          style={{
            height: '100%',
          }}
          src="https://dtcdata.oss-cn-shanghai.aliyuncs.com/asset/image/banner.png"
        />
      </View>
      <View className=" mb-[190px] mt-[73px] px-[30px]">
        <View className="font-bold flex lading-[56px] h-[56px]">
          <Text className="bg-[#96CC39] w-[9px] h-full rounded" />
          <Text className="ml-[18px] text-[48px]">顶级兽医营养师专研配方</Text>
        </View>
        <View className="pb-[50px]">
          {formulaData.map((item, key) => (
            <Formula data={item} key={key} />
          ))}
        </View>
        <FreshPlan />
        <View className="bg-transparent fixed bottom-0 left-0 w-full z-10 pt-1 pb-2">
          <Button
            className="mx-4 rounded-full flex items-center bg-color-primary justify-center border-0"
            type="primary"
            onClick={(e) => {
              e.stopPropagation()
              handleLogin(() => {
                Taro.navigateTo({ url: '/pages/packageA/choosePet/index' })
              })
            }}
          >
            <AtIcon className="mr-1" value="clock" size="26" />
            定制鲜粮
          </Button>
        </View>
      </View>
    </View>
  )
}

export default PetDiet
