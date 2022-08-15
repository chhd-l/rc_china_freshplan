import { Swiper, SwiperItem, View } from '@tarojs/components'
import { useState } from 'react'
import './index.less'
import { titleSwiperList } from './index.module'

const Subscription = () => {
  const [current, setCurrent] = useState(0)
  return (
    <View className="subscription">
      <View className="TitleSwiper relative">
        <Swiper current={current} circular autoplay interval={2000} onChange={(e) => setCurrent(e.detail.current)}>
          {/* {titleSwiperList.map((_, key) => (
            <SwiperItem key={key} className="bg-red-500">
              xxxxx
            </SwiperItem>
          ))} */}
          <SwiperItem className="bg-red-500 p-3">
            <View>为爱宠探索定制鲜食体验~</View>
            <View className="my-1">新鲜完整的食材，用心将鲜食做到极致，精准定制方案</View>
            <View>仅需30秒哦~</View>
          </SwiperItem>
        </Swiper>
        <View className="indicatorDots absolute w-full">
          <View className="flex items-center justify-center">
            {titleSwiperList.map((_, key) => (
              <View key={key} className={`${current === key && 'selectInd'} rounded-full`} />
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

export default Subscription
