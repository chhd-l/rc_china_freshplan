import { useState } from 'react';
import { View, Image } from '@tarojs/components';
import { AtProgress } from 'taro-ui';
import Step1 from '@/components/consumer/EditPet/step1';
import Step2 from '@/components/consumer/EditPet/step2';

import './index.less';

const petEdit = () => {
  const [step, setStep] = useState<25 | 50 | 75 | 100>(25);

  return (
    <View className="pet-edit-page">
      <View className="pet-edit-progress">
        <AtProgress percent={step} strokeWidth={6} isHidePercent color='#96CC39' />
      </View>
      {
        step === 25
          ? <Step1 pet={{}} onStepChange={setStep} />
          : step === 50
          ? <Step2 pet={{}} onStepChange={setStep} />
          : null
      }
    </View>
  );
}

export default petEdit
