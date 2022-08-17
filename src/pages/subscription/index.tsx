import { Image, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import Step from '@/components/subscription/Step'
import FreshFoodExperience from '@/components/subscription/Freshfoodexperience'
import LovePetHealth from '@/components/subscription/LovePetHealth'
import CommonProblem from '@/components/subscription/CommonProblem'
import home_foot_img from '@/assets/img/home_foot_img.png'
import { useState } from 'react'
import { AtButton, AtIcon } from 'taro-ui'
import './index.less'
import { titleSwiperList } from './index.module'

const Subscription = () => {
  const [current, setCurrent] = useState(0)
  return (
    <View className="subscription">
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
          <AtButton className="mx-4 rounded-full flex items-center" type="primary">
            <AtIcon className="mr-1" value="clock" size="26" />
            开始定制
          </AtButton>
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
          <AtButton className="mx-4 rounded-full flex items-center" type="primary">
            <AtIcon className="mr-1" value="clock" size="26" />
            开始定制
          </AtButton>
        </View>
        <View className="w-full h-[750px]">
          <Image src={home_foot_img} />
        </View>
      </View>
    </View>
  )
}

export default Subscription
