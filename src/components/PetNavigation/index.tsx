import { View, Text, Swiper, SwiperItem } from '@tarojs/components'
import PetItem from '../common/PetItem'
import { PetListItemProps } from '@/framework/types/consumer'
import { useState } from 'react'

import './index.less'

interface IProps {
  petList?: PetListItemProps[]
  hasSelect?: boolean
  onSelect?: (pet: PetListItemProps) => void
  hasAdd?: boolean
  onAdd?: Function
  selectedPetId?: string
}

const PetNavigation = ({ petList = [], hasAdd = false, hasSelect = false, onSelect, onAdd, selectedPetId }: IProps) => {
  const [current, setCurrent] = useState<number>(0);
  console.log('current:', current);

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
          <Text className="rcciconfont rccicon-right text-28 text-gray-400" />
        </View>
      </View>
    )
  } else if (petList.length === 1) {
    return (
      <View className={`flex items-center justify-around`}>
        {petList.map((item: PetListItemProps, idx: number) => (
          <PetItem key={idx} pet={item} hasSelect={hasSelect} selected={item.id === selectedPetId} onClick={() => onSelect && onSelect(item)} />
        ))}
        {hasAdd ? <PetItem isAdd={true}  onClick={() => onAdd && onAdd()} /> : null}
      </View>
    )
  } else if ((!hasAdd && petList.length <= 4) || (hasAdd && petList.length <= 3)) {
    return (
      <View className={`flex items-center justify-around`}>
        {petList.map((item: PetListItemProps, idx: number) => (
          <PetItem key={idx} pet={item} hasSelect={hasSelect} selected={item.id === selectedPetId} onClick={() => onSelect && onSelect(item)} />
        ))}
        {hasAdd ? <PetItem isAdd={true} onClick={() => onAdd && onAdd()} /> : null}
      </View>
    )
  } else {
    let navArr: number[] = [], navSize = petList.length;
    if (hasAdd) {
      navSize = navSize + 1;
    }
    for (let i = 0, len = navSize % 4 + 1; i < len; i ++) {
      navArr.push(i);
    }
    return (
      <View>
        <Swiper
          current={current}
          onChange={(e) => setCurrent(e.detail.current)}
          displayMultipleItems={4}
          className="w-full overflow-hidden"
        >
          {petList.map((item: PetListItemProps, idx: number) => (
            <SwiperItem key={idx} className="mr-2 inline-block">
              <PetItem pet={item} hasSelect={hasSelect} selected={item.id === selectedPetId} onClick={() => onSelect && onSelect(item)} />
            </SwiperItem>
          ))}
          {hasAdd ? <SwiperItem><PetItem isAdd={true} onClick={() => onAdd && onAdd()} /></SwiperItem> : null}
        </Swiper>
        <View className="flex justify-center">
          <View className="pet-list-nav flex items-center">
            {navArr.map((item: number) => (
              <Text key={item} className={`nav-item ${item === current ? 'active' : ''}`} />
            ))}
          </View>
        </View>
      </View>
    )
  }
}

export default PetNavigation;
