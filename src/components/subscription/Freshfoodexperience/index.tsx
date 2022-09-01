import { Button, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.less'

const FreshFoodExperience = () => {
  return (
    <View className="Freshfoodexperience h-[1071px] mt-[76px] flex items-end justify-center">
      <Button
        className="mx-2 mb-[47px] w-full rounded-full flex items-center bg-color-primary justify-center border-0"
        type="primary"
        onClick={() => {
          Taro.navigateTo({ url: '/pages/packageA/petDiet/index' })
        }}
      >
        查看饮食
      </Button>
    </View>
  )
}

export default FreshFoodExperience
