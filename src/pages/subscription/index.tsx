import { Image, Swiper, SwiperItem, Text, View, Button } from '@tarojs/components'
import Step from '@/components/subscription/Step'
import FreshFoodExperience from '@/components/subscription/Freshfoodexperience'
import LovePetHealth from '@/components/subscription/LovePetHealth'
import CommonProblem from '@/components/subscription/CommonProblem'
import home_foot_img from '@/assets/img/home_foot_img.png'
import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { consumerAtom } from '@/store/consumer'
import { loginWithAlipay } from '@/components/consumer/AuthLogin/alipay-login'
import { wxLogin } from '@/framework/api/consumer/consumer'
import { AtButton, AtIcon } from 'taro-ui'
import './index.less'
import { titleSwiperList } from './index.module'
import Taro from '@tarojs/taro'

const Subscription = () => {
  const [current, setCurrent] = useState(0)
  const [consumer, setConsumer] = useAtom(consumerAtom)

  const loginInit = async () => {
    const _storeRes: any = Taro.getStorageSync("wxLoginRes");
    if (_storeRes?.userInfo?.id) {
      const data = await wxLogin()
      setConsumer(data)
    }
  }

  const handleLogin = (callback?: Function) => {
    if (consumer?.id) {
      callback && callback();
    } else {
      loginWithAlipay((data) => {
        setConsumer(data);
        callback && callback();
      })
    }
  }

  Taro.useDidShow(() => {
    my.setNavigationBar({ image: 'https://dtcdata.oss-cn-shanghai.aliyuncs.com/asset/image/fresh-plan-logo.png' })
    loginInit()
  })
  
  return (
    <View className="subscription bg-white">
      <View className="TitleSwiper relative">
        <Swiper current={current} circular autoplay interval={2000} onChange={(e) => setCurrent(e.detail.current)}>
          {titleSwiperList.map((item, key) => (
            <SwiperItem key={key}>
              <View className="p-3">
                <View>{item.title}</View>
                <View className="my-1">{item.p}</View>
                <View>{item.span}</View>
              </View>
            </SwiperItem>
          ))}
        </Swiper>
        <View className="indicatorDots absolute w-full bg-white">
          {consumer?.id ? <Button
            className="mx-4 rounded-full flex items-center bg-color-primary justify-center border-0"
            type="primary"
            onClick={() => {
              Taro.navigateTo({ url: '/pages/petEdit/index' });
            }}
          >
            <AtIcon className="mr-1" value="clock" size="26" />
            开始定制
          </Button> : <Button
            className="mx-4 rounded-full flex items-center bg-color-primary justify-center border-0"
            type="primary"
            openType="getAuthorize"
            scope="phoneNumber"
            onGetAuthorize={() => {
              handleLogin(() => {
                Taro.navigateTo({ url: '/pages/petEdit/index' });
              })
            }}
          >
            <AtIcon className="mr-1" value="clock" size="26" />
            开始定制
          </Button>}
          <View className="flex my-1 items-center justify-center">
            {titleSwiperList.map((_, key) => (
              <View key={key} className={`${current === key && 'selectInd'} rounded-full`} />
            ))}
          </View>
        </View>
      </View>
      <View className="px-[20px]">
        <Step />
        <FreshFoodExperience />
        <LovePetHealth />
        <CommonProblem />
        <View className="mt-[100px] mb-[70px]">
          {consumer?.id ? <Button
            className="mx-4 rounded-full flex items-center bg-color-primary border-0 justify-center"
            type="primary"
            onClick={() => {
              Taro.navigateTo({ url: '/pages/petEdit/index' });
            }}
          >
            <AtIcon className="mr-1" value="clock" size="26" />
            开始定制
          </Button> : <Button
            className="mx-4 rounded-full flex items-center bg-color-primary border-0 justify-center"
            type="primary"
            openType="getAuthorize"
            scope="phoneNumber"
            onGetAuthorize={() => {
              handleLogin(() => {
                Taro.navigateTo({ url: '/pages/petEdit/index' });
              })
            }}
          >
            <AtIcon className="mr-1" value="clock" size="26" />
            开始定制
          </Button>}
        </View>
        <View className="w-full h-[750px] ">
          <Image src={home_foot_img} />
        </View>
      </View>
    </View>
  )
}

export default Subscription
