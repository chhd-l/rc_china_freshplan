import { View, Text, Input } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import PetTitle from './components/PetTitle';
import { IProps } from './step1';

import './step.less';

const Step3 = ({ pet, onStepChange }: IProps) => {
  return (
    <View className="mx-1 mt-2">
      <View className="mt-4">
        <PetTitle>xx的品种是</PetTitle>
      </View>
      <View className="mt-2 rcc-single-choice grid grid-cols-3">
        <Text className="rcc-choice-item text-28 font-bold">博美犬</Text>
        <Text className="rcc-choice-item text-28 font-bold">比熊犬</Text>
        <Text className="rcc-choice-item text-28 font-bold">拉布拉多犬</Text>
        <Text className="rcc-choice-item text-28 font-bold">博美犬</Text>
        <Text className="rcc-choice-item text-28 font-bold">比熊犬</Text>
        <Text className="rcc-choice-item text-28 font-bold">拉布拉多犬</Text>
      </View>
      <View className="mt-1 choose-other-breed flex items-center">
        <Text className="text-28 mx-2 flex-1 font-bold">选择其它品种</Text>
        <Text className="rcciconfont rccicon-add text-48 mx-2" />
      </View>
    </View>
  );
}

export default Step3;
