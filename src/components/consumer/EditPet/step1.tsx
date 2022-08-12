import { View, Text } from '@tarojs/components';
import PetTitle from './components/PetTitle';

import './step.less';

export interface IProps {
  pet: any;
  onStepChange: (step: 25 | 50 | 75 | 100) => void;
}

const Step1 = ({ pet, onStepChange }: IProps) => {

  const handleGenderChange = () => {
    onStepChange(50)
  }

  return (
    <View className="mx-1 mt-2">
      <PetTitle>您的爱宠是</PetTitle>
      <Text className="text-24" style={{marginLeft: '14PX'}}>爱宠的健康之旅，从这里开始。</Text>
      <View className="mt-3 flex justify-around items-center">
        <View className="gender-choice text-center" onClick={handleGenderChange}>
          <View className="cat flex items-center justify-center">
            <Text className="rcciconfont rccicon-cat1"></Text>
          </View>
          <View className="mt-1 text-28">猫</View>
        </View>
        <View className="gender-choice text-center active" onClick={handleGenderChange}>
          <View className="dog flex items-center justify-center">
            <Text className="rcciconfont rccicon-dog1"></Text>
          </View>
          <View className="mt-1 text-28">狗</View>
        </View>
      </View>
    </View>
  )
}

export default Step1;