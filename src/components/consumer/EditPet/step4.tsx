import { useState } from 'react';
import { View, Text, Picker } from '@tarojs/components';
import { PetStep } from '@/framework/types/consumer';
import Taro from '@tarojs/taro';
import PetTitle from './components/PetTitle';
import { IProps } from './step1';

import './step.less';

const Step4 = ({ pet, onStepChange, onChange }: IProps) => {

  const handleChangeDate = (e) => {
    onChange('birthday', e.detail.value);
  }

  return (
    <View className="mx-1 mt-2">
      <View className="mt-4">
        <PetTitle>{pet.name}多大了<Text className="ml-1 text-22 text-gray-800">(请选择出生日期)</Text></PetTitle>
      </View>
      <View>
        <Picker
          style={{ borderWidth: '0px !important', backgroundColor: 'transparent !important' }}
          value={pet.birthday}
          mode="date"
          end={new Date().toLocaleString().split(' ')[0].replace(/\//g, '-')}
          onChange={handleChangeDate}
        >
          <View className="mt-1 choose-other-breed flex items-center">
            <Text className="text-28 mx-2 flex-1 font-bold">{pet.birthday ? pet.birthday.replace('-', '年').replace('-', '月') + '日' : '请选择'}</Text>
            <Text className="rcciconfont rccicon-right text-34 mx-2" />
          </View>
        </Picker>
      </View>
      
      <View className="pet-edit-btns">
        <View className="grid grid-cols-2">
          <Text className="btn-item" onClick={() => onStepChange(PetStep.STEP3)}>上一步</Text>
          <Text className="btn-item active" onClick={() => onStepChange(PetStep.STEP5)}>下一步</Text>
        </View>
      </View>
    </View>
  );
}

export default Step4;
