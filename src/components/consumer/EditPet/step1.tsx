import { View, Text, Image } from '@tarojs/components';
import PetTitle from './components/PetAddTitle';
import { PetListItemProps, PetType, PetStep } from '@/framework/types/consumer';
import { CDNIMGURL2, CDNIMGURL } from '@/lib/constants';

import './step.less';

export interface IProps {
  pet: PetListItemProps;
  onStepChange: (step: PetStep) => void;
  onChange: (key: keyof PetListItemProps, value: any) => void;
}

interface IProps1 extends IProps {
  onChangeAll: (obj: Partial<PetListItemProps>) => void;
}

const Step1 = ({ pet, onStepChange, onChangeAll }: IProps1) => {

  const handleTypeChange = (type: PetType) => {
    onChangeAll({
      type: type,
      image: type === PetType.Cat ? `${CDNIMGURL2}cat-default.png` : `${CDNIMGURL2}dog-default.png`,
    })
    onStepChange(PetStep.STEP2);
  }

  return (
    <View className="mx-1 pt-2">
      <View className="mt-1"></View>
      <PetTitle>您的爱宠是</PetTitle>
      <View>
        <Text className="text-26 text-gray-600" style={{marginLeft: '14PX'}}>爱宠的健康之旅，从这里开始。</Text>
      </View>
      <View className="mt-3 flex justify-around items-center">
        <View className={`gender-choice text-center ${pet.type === PetType.Cat ? 'active' : ''}`} onClick={() => handleTypeChange(PetType.Cat)}>
          <View className="cat flex items-center justify-center">
            <Image src={`${CDNIMGURL2}cat-default.png`} mode="widthFix" />
            <Image className="choice" mode="widthFix" src={pet.type === PetType.Cat ? `${CDNIMGURL}selected-s.png` : `${CDNIMGURL}unselected.png`} />
          </View>
          <View className="mt-1 text-32 text-gray-400">猫猫</View>
        </View>
        <View className={`gender-choice text-center ${pet.type === PetType.Dog ? 'active' : ''}`} onClick={() => handleTypeChange(PetType.Dog)}>
          <View className="dog flex items-center justify-center">
            <Image src={`${CDNIMGURL2}dog-default.png`} mode="widthFix" />
            <Image className="choice" mode="widthFix" src={pet.type === PetType.Dog ? `${CDNIMGURL}selected-s.png` : `${CDNIMGURL}unselected.png`} />
          </View>
          <View className="mt-1 text-32 text-gray-400">狗狗</View>
        </View>
      </View>
    </View>
  )
}

export default Step1;
