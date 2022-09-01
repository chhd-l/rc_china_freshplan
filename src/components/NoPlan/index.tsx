import { loginWithAlipay } from '@/components/consumer/AuthLogin/alipay-login'
import CommonProblem from '@/components/subscription/CommonProblem'
import FreshFoodExperience from '@/components/subscription/Freshfoodexperience'
import LovePetHealth from '@/components/subscription/LovePetHealth'
import Step from '@/components/subscription/Step'
import { consumerAtom } from '@/store/consumer'
import {
  BaseEventOrig,
  Button,
  Image,
  ScrollView,
  ScrollViewProps,
  Swiper,
  SwiperItem,
  Text,
  View,
} from '@tarojs/components'
import Vector from '@/assets/icons/Vector.png'
import Taro from '@tarojs/taro'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { AtIcon } from 'taro-ui'
import './index.less'
import { titleSwiperList } from './index.module'

const scrollTop = 0
const Threshold = 20
const Subscription = () => {
  const [current, setCurrent] = useState(0)
  const [consumer, setConsumer] = useAtom(consumerAtom)
  const [scrollHeight, setScrollHeight] = useState(0)
  const onScroll = (e: BaseEventOrig<ScrollViewProps.onScrollDetail>) => setScrollHeight(e.detail.scrollTop)

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
    <View className="bg-[#d3e4b5]">
      <View className={`${scrollHeight > 600 ? 'block' : 'hidden'} bg-white fixed bottom-0 left-0 w-full z-10 py-1`}>
        {consumer?.id ? (
          <Button
            className="mx-4 rounded-full flex items-center bg-color-primary justify-center border-0"
            type="primary"
            onClick={() => {
              Taro.navigateTo({ url: '/pages/packageA/choosePet/index' })
            }}
          >
            <AtIcon className="mr-1" value="clock" size="26" />
            开始定制
          </Button>
        ) : (
          <Button
            className="mx-4 rounded-full flex items-center bg-color-primary justify-center border-0"
            type="primary"
            openType="getAuthorize"
            scope="phoneNumber"
            onGetAuthorize={() => {
              handleLogin(() => {
                Taro.navigateTo({ url: '/pages/packageA/choosePet/index' })
              })
            }}
          >
            <AtIcon className="mr-1" value="clock" size="26" />
            开始定制
          </Button>
        )}
      </View>
      <ScrollView
        className="scrollview bg-[#d3e4b5]"
        scrollY
        scrollWithAnimation
        scrollTop={scrollTop}
        // style={{ height: scrollHeight > 600 ? '89vh' : '100vh' }}
        style={{ height: '100vh' }}
        lowerThreshold={Threshold}
        onScroll={onScroll}
      >
        <View className="subscription bg-[#d3e4b5]">
          <View className="TitleSwiper relative">
            <Swiper current={current} circular autoplay interval={2000} onChange={(e) => setCurrent(e.detail.current)}>
              {titleSwiperList.map((item, key) => (
                <SwiperItem key={key}>
                  <View className="py-3 pl-[40px] pr-2">
                    <View className="flex flex-row">
                      <View className="w-[60px] h-[60px]">
                        <Image src={Vector} />
                      </View>
                      <Text>{item.title}</Text>
                    </View>
                    <View className="my-1 ml-[60px]">{item.p}</View>
                    <View className="ml-[60px]">{item.span}</View>
                  </View>
                </SwiperItem>
              ))}
            </Swiper>
            <View className="indicatorDots absolute w-full">
              <View className="flex my-1 items-center justify-center">
                {titleSwiperList.map((_, key) => (
                  <View key={key} className={`${current === key && 'selectInd'} rounded-full`} />
                ))}
              </View>
              {consumer?.id ? (
                <Button
                  className="mx-4 rounded-full flex items-center bg-color-primary justify-center border-0"
                  type="primary"
                  onClick={() => {
                    Taro.navigateTo({ url: '/pages/packageA/choosePet/index' })
                  }}
                >
                  <AtIcon className="mr-1" value="clock" size="26" />
                  开始定制
                </Button>
              ) : (
                <Button
                  className="mx-4 rounded-full flex items-center bg-color-primary justify-center border-0"
                  type="primary"
                  openType="getAuthorize"
                  scope="phoneNumber"
                  onGetAuthorize={() => {
                    handleLogin(() => {
                      Taro.navigateTo({ url: '/pages/packageA/choosePet/index' })
                    })
                  }}
                >
                  <AtIcon className="mr-1" value="clock" size="26" />
                  开始定制
                </Button>
              )}
            </View>
          </View>
          <View className="px-[30px]">
            <Step />
            <FreshFoodExperience />
            <LovePetHealth />
            <CommonProblem />
            <View className="h-[750px] mx-[-30px]">
              <Image
                src="https://dtcdata.oss-cn-shanghai.aliyuncs.com/asset/image/home_foot_img.png"
                style={{
                  transform: 'translateY(20px)',
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Subscription
