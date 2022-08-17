import { View } from '@tarojs/components'
import { useEffect } from 'react'

const PetDiet = () => {
  useEffect(() => {
    my.setNavigationBar({ image: 'https://dtcdata.oss-cn-shanghai.aliyuncs.com/asset/image/fresh-plan-logo.png' })
  }, [])

  return <View>111</View>
}

export default PetDiet
