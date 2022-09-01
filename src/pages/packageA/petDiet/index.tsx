import { loginWithAlipay } from '@/components/consumer/AuthLogin/alipay-login'
import Formula from '@/components/petDiet/Formula'
import FreshPlan from '@/components/petDiet/FreshPlan'
import { consumerAtom } from '@/store/consumer'
import { Button, Image, Text, View } from '@tarojs/components'
import Taro, { useReachBottom } from '@tarojs/taro'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { Consumer } from '@/framework/types/consumer'
import { AtIcon } from 'taro-ui'
import { formulaData } from './index.module'

const PetDiet = () => {
  const [consumer, setConsumer] = useAtom(consumerAtom)
  const [open, setOpen] = useState(false)

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

  useReachBottom(() => {
    setOpen(true)
  })

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
      <View className=" mb-[70px] mt-[73px] px-[30px]">
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
        {open && (
          <View className="leading-[30px] text-[26px] text-[#666] text-center mt-[20px] mb-[45px]">没有更多了</View>
        )}
        <Button
          className="mx-1 mt-1 rounded-full flex items-center bg-color-primary justify-center border-0"
          type="primary"
          onGetAuthorize={() => {
            handleLogin(() => {
              Taro.navigateTo({ url: '/pages/packageA/choosePet/index' })
            })
          }}
        >
          <AtIcon className="mr-1" value="clock" size="26" />
          开始定制
        </Button>
      </View>
    </View>
  )
}

export default PetDiet
