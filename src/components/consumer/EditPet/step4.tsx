import { View, Text, Picker } from '@tarojs/components';
import { PetStep } from '@/framework/types/consumer';
import PetTitle from './components/PetTitle';
import { IProps } from './step1';
import moment from 'moment';
import Taro from '@tarojs/taro';

import './step.less';

const Step4 = ({ pet, onStepChange, onChange }: IProps) => {

  const handleChangeDate = (e) => {
    const d = moment(e.detail.value);
    onChange('birthday', d.format('YYYY-MM-DD'));
  }

  const handleNext = () => {
    if (!pet.birthday) {
      Taro.showToast({ title: '请先选择生日' });
    } else {
      onStepChange(PetStep.STEP5);
    }
  }

  return (
    <View className="mx-1 pt-2">
      <View className="mt-2">
        <PetTitle>{pet.name}多大了<Text className="ml-1 text-22 text-gray-200">(请选择出生日期)</Text></PetTitle>
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
            <Text className="text-28 mx-1 flex-1 font-bold">{pet.birthday ? pet.birthday.replace('-', '年').replace('-', '月') + '日' : '请选择'}</Text>
            <Text className="rcciconfont rccicon-right text-34 mx-1" />
          </View>
        </Picker>
      </View>
      
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
