import { View, Text, Input } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import PetTitle from './components/PetTitle';
import { IProps } from './step1';

const Step2 = ({ pet, onStepChange }: IProps) => {
  return (
    <View className="mx-1 mt-2">
      <View className="mt-3 text-center flex justify-center">
        <View className="pet-avatar flex justify-center items-center">
          <Text className="rcciconfont rccicon-dog2"></Text>
        </View>
      </View>
      <View className="mt-4">
        <PetTitle>您爱宠的昵称是</PetTitle>
      </View>
      <View className="mt-2 flex justify-between items-center">
        <View>
          <Input className="rcc-input" />
        </View>
        <Text className="rcciconfont rccicon-success text-color-primary text-38"></Text>
      </View>
    </View>
  );
}

export default Step2;
