import { View, Text, ScrollView } from '@tarojs/components'
import PetItem from '../common/PetItem'
import { AtIcon } from 'taro-ui'
import { PetListItemProps } from '@/framework/types/consumer'

import './index.less'

interface IProps {
  petList?: PetListItemProps[]
  onSelect?: (pet: PetListItemProps) => void
  hasAdd?: boolean
  onAdd?: Function
  selectedPetId?: string
}

const PetNavigation = ({ petList = [], hasAdd = false, onSelect, onAdd, selectedPetId }: IProps) => {

  if ((petList ?? []).length === 0) {
    return (
      <View className="flex items-center" onClick={() => onAdd && onAdd()}>
        <View className="petlistnav-add-icon flex justify-center items-center">
          <Text className="rcciconfont rccicon-add text-42" />
        </View>
        <View className="mx-1 flex-1">
          <View className="mb-0.5 text-32 font-bold">添加爱宠</View>
          <View className="text-28 text-gray-400">给它定制专属食物</View>
        </View>
        <View>
          <AtIcon size="28" value="chevron-right text-gray-400" />
        </View>
      </View>
    )
  } else if (petList.length === 1) {
    return (
      <View className={`flex items-center justify-around`}>
        {petList.map((item: PetListItemProps, idx: number) => (
          <PetItem key={idx} pet={item} hasSelect={!!onSelect} selected={item.id === selectedPetId} onClick={() => onSelect && onSelect(item)} />
        ))}
        {hasAdd ? <PetItem isAdd={true}  onClick={() => onAdd && onAdd()} /> : null}
      </View>
    )
  } else if ((!hasAdd && petList.length <= 4) || (hasAdd && petList.length <= 3)) {
    return (
      <View className={`flex items-center justify-between`}>
        {petList.map((item: PetListItemProps, idx: number) => (
          <PetItem key={idx} pet={item} hasSelect={!!onSelect} selected={item.id === selectedPetId} onClick={() => onSelect && onSelect(item)} />
        ))}
        {hasAdd ? <PetItem isAdd={true} /> : null}
      </View>
    )
  } else {
    return (
      <ScrollView scrollX className="whitespace-nowrap">
        {petList.map((item: PetListItemProps, idx: number) => (
          <View key={idx} className="mr-2 inline-block">
            <PetItem pet={item} hasSelect={!!onSelect} selected={item.id === selectedPetId} onClick={() => onSelect && onSelect(item)} />
          </View>
        ))}
        {hasAdd ? <View className="inline-block"  onClick={() => onAdd && onAdd()}><PetItem isAdd={true} /></View> : null}
      </ScrollView>
    )
  }
}

export default PetNavigation;
