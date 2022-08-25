import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { AtProgress } from 'taro-ui';
import { PetListItemProps, PetStep } from '@/framework/types/consumer';
import { addPet } from '@/framework/api/pet/add-pet';
import Taro from '@tarojs/taro';
import Step1 from '@/components/consumer/EditPet/step1';
import Step2 from '@/components/consumer/EditPet/step2';
import Step3 from '@/components/consumer/EditPet/step3';
import Step4 from '@/components/consumer/EditPet/step4';
import Step5 from '@/components/consumer/EditPet/step5';
import Step6 from '@/components/consumer/EditPet/step6';

import './index.less'

const petEdit = () => {
  const [step, setStep] = useState<PetStep>(PetStep.STEP1);
  const [pet, setPet] = useState<PetListItemProps>({
    age: '',
    birthday: '',
    breed: '',
    code: '',
    gender: undefined,
    id: '-1',
    image: '',
    isSterilized: false,
    name: '',
    type: undefined,
  });

  const handleSetPet = (key: keyof PetListItemProps, value: any) => {
    setPet(Object.assign({}, pet, { [key]: value }));
  }

  const handleSetPetAll = (obj: Partial<PetListItemProps>) => {
    setPet(Object.assign({}, pet, obj));
  }

  const handleSave = async () => {
    const res = await addPet(pet);
    console.log('add pet response:', res);
    if (res) {
      Taro.setStorageSync("petItem", { ...pet, id: res?.id });
      Taro.redirectTo({
        url: '/pages/foodRecom/index',
      })
    } else {
      Taro.showToast({ title: '保存失败' });
    }
  }

  return (
    <View className="pet-edit-page">
      <View className="pet-edit-progress px-1">
        <AtProgress percent={step} strokeWidth={6} isHidePercent color='#96CC39' />
        <Text className="p-per" style={{left: `${step}%`}}>{step}%</Text>
      </View>
      {
        step === PetStep.STEP1
          ? <Step1 pet={pet} onStepChange={setStep} onChange={handleSetPet} onChangeAll={handleSetPetAll} />
          : step === PetStep.STEP2
          ? <Step2 pet={pet} onStepChange={setStep} onChange={handleSetPet} />
          : step === PetStep.STEP3
          ? <Step3 pet={pet} onStepChange={setStep} onChange={handleSetPet} onChangeAll={handleSetPetAll} />
          : step === PetStep.STEP4
          ? <Step4 pet={pet} onStepChange={setStep} onChange={handleSetPet} />
          : step === PetStep.STEP5
          ? <Step5 pet={pet} onStepChange={setStep} onChange={handleSetPet} onChangeAll={handleSetPetAll} />
          : step === PetStep.STEP6
          ? <Step6 pet={pet} onStepChange={setStep} onChange={handleSetPet} onSave={handleSave} />
          : null
      }
    </View>
  )
}

export default petEdit
