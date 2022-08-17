import PetTitle from '@/components/consumer/EditPet/components/PetTitle'
import IconFont from '@/components/iconfont'
import { Image, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import { useState } from 'react'
import freshFood from '../../../assets/img/freshFoodbg.png'
import './index.less'
import { swiperList } from './index.modules'

const LovePetHealth = () => {
  const [current, setCurrent] = useState(0)

  return (
    <View className="petHealth">
      <View className="ml-[20px] mb-[70px] mt-[73px]">
        <PetTitle>
          <Text className="text-[48px]">专业的科研团队 时刻守护您的爱宠健康</Text>
        </PetTitle>
        <IconFont name="male" size={50} />
      </View>
      <View className="px-[50px]">
        <Swiper
          className="test-h"
          indicatorColor="#999"
          indicatorActiveColor="#333"
          circular
          autoplay
          current={current}
          onChange={(e) => setCurrent(e.detail.current)}
        >
          {swiperList.map((item, key) => (
            <SwiperItem key={key}>
              <View className=" flex flex-col justify-center items-center">
                <View className="w-[205px] h-[205px] rounded-[50%] overflow-hidden">
                  <Image src={item.imgUrl} className="w-full h-full" />
                </View>
                <View className="text-[24px] mt-[27px] mb-[20px]">{item.name}</View>
                <View className="text-[20px] mb-[63px]">{item.position}</View>
                <View className="text-center mb-[20px]">{item.desc}</View>
              </View>
            </SwiperItem>
          ))}
        </Swiper>
        <View className="flex my-1 items-center justify-center">
          {swiperList.map((_, key) => (
            <View key={key} className={`${current === key && 'selectInd'} rounded-full`} />
          ))}
        </View>
      </View>
    </View>
  )
}

export default LovePetHealth
