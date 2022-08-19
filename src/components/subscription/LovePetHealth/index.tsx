import PetTitle from '@/components/consumer/EditPet/components/PetTitle'
import { Image, Swiper, SwiperItem, View } from '@tarojs/components'
import { useState } from 'react'
import './index.less'
import { swiperList } from './index.modules'

const LovePetHealth = () => {
  const [current, setCurrent] = useState(0)

  return (
    <View className="petHealth">
      <View className="ml-[20px] mb-[70px] mt-[73px]">
        <PetTitle>
          <View className="text-[48px]">专业的科研团队 </View>
          <View className="text-[48px]">时刻守护您的爱宠健康</View>
        </PetTitle>
      </View>
      <View className="pt-[50px]  m-auto w-full relative">
        <Swiper
          className=""
          circular
          autoplay
          displayMultipleItems={1}
          current={current}
          onChange={(e) => setCurrent(e.detail.current)}
        >
          {swiperList.map((item, key) => (
            <SwiperItem key={key}>
              <View className=" flex flex-col justify-center items-center shadow w-[465px] m-auto h-[550px] bg-[#FAFAFA]">
                <View className="w-[205px] h-[205px] rounded-[50%] overflow-hidden">
                  <Image src={item.imgUrl} className="w-full h-full" />
                </View>
                <View className="text-[24px] mt-[27px] mb-[20px]">{item.name}</View>
                <View className="text-[20px] mb-[63px]">{item.position}</View>
                <View className="text-center mb-[20px] text-[20px] px-[46px] leading-[23px]">{item.desc}</View>
              </View>
            </SwiperItem>
          ))}
        </Swiper>
        <View className="indicatorDots absolute w-full bg-white">
          <View className="flex my-1 items-center justify-center">
            {swiperList.map((_, key) => (
              <View key={key} className={`${current === key && 'selectInd'} rounded-full`} />
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

export default LovePetHealth
