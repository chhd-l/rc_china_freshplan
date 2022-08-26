import { View, Text, Image } from '@tarojs/components'
import { PetListItemProps } from '@/framework/types/consumer'
import { CDNIMGURL } from '@/lib/constants'

import './index.less'

interface IProps {
  pet?: PetListItemProps
  hasSelect?: boolean
  selected?: boolean
  isAdd?: boolean
  onClick?: Function
}

const PetItem = ({ pet, hasSelect = false, selected = false, isAdd = false, onClick }: IProps) => {

  const handleClick = () => {
    onClick && onClick()
  }

  return (
    <View className={`rcc-pet-item ${isAdd ? 'add' : ''}`} onClick={handleClick}>
      <View className="rcc-pet-item-image">
        {isAdd ? <Image mode="widthFix" src={pet?.image ?? ""} /> : <Text className="rcciconfont rccicon-add" />}
      </View>
      <View className="rcc-pet-item-name text-center text-gray-600 text-26 truncate">{pet?.name ?? "添加爱宠"}</View>
      {hasSelect ? <View className="rcc-pet-item-select">
        <Image src={selected ? `${CDNIMGURL}selected-s.png` : `${CDNIMGURL}un-selected.png`} mode="widthFix" />
      </View> : null}
    </View>
  )
}

export default PetItem;
