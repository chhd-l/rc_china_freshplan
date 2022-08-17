import PetTitle from '@/components/consumer/EditPet/components/PetTitle'
import { Image, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import freshFood from '../../../assets/img/freshFoodbg.png'

const LovePetHealth = () => {
  return (
    <View>
      <View className="ml-[20px] mb-[70px] mt-[73px]">
        <PetTitle>
          <Text className="text-[48px]">专业的科研团队 时刻守护您的爱宠健康</Text>
        </PetTitle>
      </View>
      <View className="px-[50px]">
        <Swiper className="test-h" indicatorColor="#999" indicatorActiveColor="#333" circular indicatorDots autoplay>
          <SwiperItem>
            <Image src={freshFood} className="w-full h-full" />
            {/* <View className="demo-text-1">
              
            </View> */}
          </SwiperItem>
          <SwiperItem>
            <View className="demo-text-2">2</View>
          </SwiperItem>
          <SwiperItem>
            <View className="demo-text-3">3</View>
          </SwiperItem>
        </Swiper>
      </View>
    </View>
  )
}

export default LovePetHealth
