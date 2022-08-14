// import { useState } from 'react';
import { View, Text } from '@tarojs/components';
import { PetStep, PetHealth } from '@/framework/types/consumer';
import { addPet } from '@/framework/api/pet/add-pet';
import PetTitle from './components/PetTitle';
import { IProps } from './step1';

import './step.less';

const Step6 = ({ pet, onStepChange, onChange }: IProps) => {

  const handleChooseHealth = (health: PetHealth) => {
    let healthes = pet.recentHealth ?? [];
    const idx = healthes.indexOf(health);
    const noneIdx = healthes.indexOf(PetHealth.NONE);
    if (noneIdx > -1) {
      healthes.splice(noneIdx, 1);
    }
    if (health === PetHealth.NONE) {
      healthes = [health];
    } else if (idx > -1) {
      healthes.splice(idx, 1);
    } else {
      healthes.push(health);
    }
    onChange('recentHealth', healthes);
  }

  const handleSave = async () => {
    const res = await addPet(pet);
    console.log(res);
  }

  return (
    <View className="mx-1 pt-2">
      <View className="mt-2">
        <PetTitle>{pet.name}近期的健康情况<Text className="ml-1 text-22 text-gray-800">(可多选)</Text></PetTitle>
      </View>
      <View>
        <View
          className={`pet-health-item my-1 text-28 font-bold ${(pet.recentHealth ?? []).indexOf(PetHealth.PICKY_EATER) > -1 ? 'active' : ''}`}
          onClick={() => handleChooseHealth(PetHealth.PICKY_EATER)}
        >
          对食物很挑剔
        </View>
        <View
          className={`pet-health-item my-1 text-28 font-bold ${(pet.recentHealth ?? []).indexOf(PetHealth.FOOD_ALLERGIES_OR_STOMAC) > -1 ? 'active' : ''}`}
          onClick={() => handleChooseHealth(PetHealth.FOOD_ALLERGIES_OR_STOMAC)}
        >
          食物过敏或胃敏感
        </View>
        <View
          className={`pet-health-item my-1 text-28 font-bold ${(pet.recentHealth ?? []).indexOf(PetHealth.DULL_OR_FLAKY_FUR) > -1 ? 'active' : ''}`}
          onClick={() => handleChooseHealth(PetHealth.DULL_OR_FLAKY_FUR)}
        >
          无光泽或片状被毛
        </View>
        <View
          className={`pet-health-item my-1 text-28 font-bold ${(pet.recentHealth ?? []).indexOf(PetHealth.ARTHRITIS_OR_JOINT_PAIN) > -1 ? 'active' : ''}`}
          onClick={() => handleChooseHealth(PetHealth.ARTHRITIS_OR_JOINT_PAIN)}
        >
          关节炎或关节痛
        </View>
        <View
          className={`pet-health-item my-1 text-28 font-bold ${(pet.recentHealth ?? []).indexOf(PetHealth.NONE) > -1 ? 'active' : ''}`}
          onClick={() => handleChooseHealth(PetHealth.NONE)}
        >
          以上都没有
        </View>
      </View>
      
      <View className="pet-edit-btns">
        <View className="grid grid-cols-2">
          <Text className="btn-item" onClick={() => onStepChange(PetStep.STEP5)}>上一步</Text>
          <Text className="btn-item active" onClick={handleSave}>保存</Text>
        </View>
      </View>
    </View>
  );
}

export default Step6;
