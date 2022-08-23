import { View, Text } from '@tarojs/components';
import { PetStep } from '@/framework/types/consumer';
import PetTitle from './components/PetTitle';
import { IProps } from './step1';
import { useState } from 'react';
import RccDatePicker from '@/components/common/RccDatePicker';

import './step.less';

const Step4 = ({ pet, onStepChange, onChange }: IProps) => {
  const [show, setShow] = useState<boolean>(!pet.birthday);

  const handleChangeDate = (date: string) => {
    onChange('birthday', date);
  }

  const handleNext = () => {
    onStepChange(PetStep.STEP5);
  }

  return (
    <View className="mx-1 pt-2">
      <View className="mt-2">
        <PetTitle>{pet.name}多大了<Text className="ml-1 text-22 text-gray-200">(请选择出生日期)</Text></PetTitle>
      </View>
      <View className="mt-1 choose-other-breed flex items-center" onClick={() => setShow(true)}>
        <Text className="text-28 mx-1 flex-1 font-bold">{pet.birthday ? pet.birthday.replace('-', '年').replace('-', '月') + '日' : '请选择'}</Text>
        <Text className="rcciconfont rccicon-right text-34 mx-1" />
      </View>
      <RccDatePicker
        visible={show}
        value={pet.birthday}
        onChange={handleChangeDate}
        onClose={() => setShow(false)}
        onConfirm={handleNext}
      />
      {/* <View>
        <Picker
          style={{ borderWidth: '0px !important', backgroundColor: 'transparent !important' }}
          value={pet.birthday}
          mode="date"
          end={new Date().toLocaleString().split(' ')[0].replace(/\//g, '-')}
          onChange={handleChangeDate}
        >
          
        </Picker>
      </View> */}
      
      <View className="pet-edit-btns">
        <View className="grid grid-cols-2">
          <Text className="btn-item" onClick={() => onStepChange(PetStep.STEP3)}>上一步</Text>
          <Text className={`btn-item ${!pet.birthday ? 'active' : 'strong'}`} onClick={handleNext}>下一步</Text>
        </View>
      </View>
    </View>
  );
}

export default Step4;
