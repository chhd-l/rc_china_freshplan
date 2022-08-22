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

  Taro.useDidShow(() => {
    my.setNavigationBar({ image: 'https://dtcdata.oss-cn-shanghai.aliyuncs.com/asset/image/fresh-plan-logo.png' })
  })

  return (
    <View>
      <View className={`${scrollHeight > 600 ? 'block' : 'hidden'} z-10 `}>
        {consumer?.id ? (
          <Button
            className="mx-4 rounded-full flex items-center bg-color-primary justify-center border-0"
            type="primary"
            onClick={() => {
              Taro.navigateTo({ url: '/pages/packageA/petEdit/index' })
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
                Taro.navigateTo({ url: '/pages/packageA/petEdit/index' })
              })
            }}
          >
            <AtIcon className="mr-1" value="clock" size="26" />
            开始定制
          </Button>
        )}
        <View className="flex my-1 items-center justify-center">
          {titleSwiperList.map((_, key) => (
            <View key={key} className={`${current === key && 'selectInd'} rounded-full`} />
          ))}
        </View>
      </View>
      <ScrollView
        className="scrollview"
        scrollY
        scrollWithAnimation
        scrollTop={scrollTop}
        style={{ height: scrollHeight > 600 ? '89vh' : '100vh' }}
        lowerThreshold={Threshold}
        onScroll={onScroll}
      >
        <View className="subscription bg-white">
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
            <View className="indicatorDots absolute w-full bg-white">
              {consumer?.id ? (
                <Button
                  className="mx-4 rounded-full flex items-center bg-color-primary justify-center border-0"
                  type="primary"
                  onClick={() => {
                    Taro.navigateTo({ url: '/pages/packageA/petEdit/index' })
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
                      Taro.navigateTo({ url: '/pages/packageA/petEdit/index' })
                    })
                  }}
                >
                  <AtIcon className="mr-1" value="clock" size="26" />
                  开始定制
                </Button>
              )}
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
            {/* <View className="mt-[100px] mb-[70px]">
            {consumer?.id ? (
              <Button
                className="mx-4 rounded-full flex items-center bg-color-primary border-0 justify-center"
                type="primary"
                onClick={() => {
                  Taro.navigateTo({ url: '/pages/packageA/petEdit/index' })
                }}
              >
                <AtIcon className="mr-1" value="clock" size="26" />
                开始定制
              </Button>
            ) : (
              <Button
                className="mx-4 rounded-full flex items-center bg-color-primary border-0 justify-center"
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
            )}
          </View> */}
            <View className="w-full h-[750px] ">
              <Image src="https://dtcdata.oss-cn-shanghai.aliyuncs.com/asset/image/home_foot_img.png" />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default Subscription
