import { Image, Text, View } from '@tarojs/components'
import { useEffect } from 'react'
import FreshPlan from '@/components/petDiet/FreshPlan'
import PetTitle from '@/components/consumer/EditPet/components/PetTitle'
import Formula from '@/components/petDiet/Formula'
import './index.less'
import { formulaData } from './index.module'

const PetDiet = () => {
  useEffect(() => {
    my.setNavigationBar({ image: 'https://dtcdata.oss-cn-shanghai.aliyuncs.com/asset/image/fresh-plan-logo.png' })
  }, [])

  return (
    <View className="diet">
      <View className="w-full h-[772px]">
        <Image src="https://dtcdata.oss-cn-shanghai.aliyuncs.com/asset/image/banner.png" />
      </View>
      <View className=" mb-[70px] mt-[73px] px-[30px]">
        <PetTitle>
          <Text className="text-[48px]">顶级兽医营养师专研配方</Text>
        </PetTitle>
        {formulaData.map((item, key) => (
          <Formula data={item} key={key} />
        ))}
        <FreshPlan />
      </View>
    </View>
  )
}

export default PetDiet
