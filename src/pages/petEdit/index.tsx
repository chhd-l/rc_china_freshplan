import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { AtProgress } from 'taro-ui';
import { PetListItemProps, PetStep } from '@/framework/types/consumer';
import Step1 from '@/components/consumer/EditPet/step1';
import Step2 from '@/components/consumer/EditPet/step2';
import Step3 from '@/components/consumer/EditPet/step3';

import './index.less';

const petEdit = () => {
  const [step, setStep] = useState<PetStep>(PetStep.STEP1);
  const [pet, setPet] = useState<PetListItemProps>({
    age: '',
    birthday: '',
    breed: '',
    gender: undefined,
    id: '-1',
    image: '',
    isSterilized: false,
    name: '',
    type: undefined,
  });

  const handleSetPet = (key: keyof PetListItemProps, value: any) => {
    setPet(Object.assign(pet, { [key]: value }));
  }

  return (
    <View className="pet-edit-page">
      <View className="pet-edit-progress px-1">
        <AtProgress percent={step} strokeWidth={6} isHidePercent color='#96CC39' />
        <Text className="p-per" style={{left: `${step}%`}}>{step}%</Text>
      </View>
      {
        step === PetStep.STEP1
          ? <Step1 pet={pet} onStepChange={setStep} onChange={handleSetPet} />
          : step === PetStep.STEP2
          ? <Step2 pet={pet} onStepChange={setStep} onChange={handleSetPet} />
          : step === PetStep.STEP3
          ? <Step3 pet={pet} onStepChange={setStep} onChange={handleSetPet} />
          : null
      }
    </View>
  );
}

export default petEdit
