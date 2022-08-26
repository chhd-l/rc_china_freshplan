import { View, Text } from '@tarojs/components'
import PetItem from '../common/PetItem'
import { PetListItemProps } from '@/framework/types/consumer'

import './index.less'

interface IProps {
  petList?: PetListItemProps[]
  onSelect?: Function
}

const PetNavigation = ({ petList = [], onSelect }: IProps) => {

  if ((petList ?? []).length === 0) {
    return (
      <View className="flex items-center">
        <View className="petlistnav-add-icon flex justify-center items-center">
          <Text className="rcciconfont rccicon-add text-42" />
        </View>
        <View className="mx-1 flex-1"></View>
      </View>
    )
  }
}
