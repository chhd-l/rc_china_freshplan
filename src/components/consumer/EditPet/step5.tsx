import { useState } from 'react';
import { View, Text, Image, PickerView, PickerViewColumn } from '@tarojs/components';
import { PetStep, PetPosture } from '@/framework/types/consumer';
import { CDNIMGURL2 } from '@/lib/constants';
import PetTitle from './components/PetTitle';
import { AtFloatLayout } from 'taro-ui';
import { IProps } from './step1';
import Taro from '@tarojs/taro';

import './step.less';

const arr1 = ['0','1','2','3','4','5','6','7','8','9','10'];
const arr2 = ['.'];
const arr3 = ['0','1','2','3','4','5','6','7','8','9'];

const Step5 = ({ pet, onStepChange, onChange }: IProps) => {
  const [show, setShow] = useState<boolean>(false);
  const [val, setVal] = useState<number[]>([arr1.indexOf((pet?.recentWeight ?? '')[0]) ?? 0, 0, arr3.indexOf((pet?.recentWeight ?? '')[2]) ?? 0]);
  const [show1, setShow1] = useState<boolean>(false);
  const [val1, setVal1] = useState<number[]>([arr1.indexOf((pet?.targetWeight ?? '')[0]) ?? 0, 0, arr3.indexOf((pet?.targetWeight ?? '')[2]) ?? 0]);

  const handleChangeCurrentWeight = (e) => {
    const cv = e.detail.value;
    setVal(cv);
    onChange('recentWeight', arr1[cv[0] > -1 ? cv[0] : 0] + '.' + arr3[cv[2] > -1 ? cv[2] : 0]);
  }

  const handleChangeTargetWeight = (e) => {
    const cv = e.detail.value;
    setVal1(cv);
    onChange('targetWeight', arr1[cv[0] > -1 ? cv[0] : 0] + '.' + arr3[cv[2] > -1 ? cv[2] : 0]);
  }

  const handlePostureChange = (posture: PetPosture) => {
    onChange('recentPosture', posture);
  }

  const handleNext = () => {
    if (!pet.recentWeight) {
      Taro.showToast({ title: '请先设置近期体重' });
    } else if (!pet.targetWeight) {
      Taro.showToast({ title: '请先设置目标体重' });
    } else {
      onStepChange(PetStep.STEP6);
    }
  }

  return (
    <View className="mx-1 pt-2">
      <View className="mt-2">
        <PetTitle>{pet.name}近期的体重<Text className="ml-1 text-22 text-gray-800">(kg)</Text></PetTitle>
      </View>
      <View className="mt-1 choose-other-breed flex items-center" onClick={() => setShow(true)}>
        <Text className="text-28 mx-1 flex-1 font-bold">{pet.recentWeight ? pet.recentWeight : '请选择'}</Text>
        <Text className="rcciconfont rccicon-right text-34 mx-1" />
      </View>
      {pet.recentWeight ? <>
        <View className="mt-2">
          <PetTitle>{pet.name}近期的体态</PetTitle>
        </View>
        <View className="mt-1 flex items-center pet-situation">
          <View className={`flex-1 pet-situation-item ${pet.recentPosture === PetPosture.Emaciated ? 'active' : ''}`} onClick={() => handlePostureChange(PetPosture.Emaciated)}>
            <Image className="my-2" src={`${CDNIMGURL2}weight-thin.png`} />
            <View className="text-24 mb-1">瘦弱</View>
          </View>
          <View className={`flex-1 pet-situation-item ${pet.recentPosture === PetPosture.Standard ? 'active' : ''}`} onClick={() => handlePostureChange(PetPosture.Standard)}>
            <Image className="my-2" src={`${CDNIMGURL2}weight-std.png`} />
            <View className="text-24 mb-1">标准</View>
          </View>
          <View className={`flex-1 pet-situation-item ${pet.recentPosture === PetPosture.Obesity ? 'active' : ''}`} onClick={() => handlePostureChange(PetPosture.Obesity)}>
            <Image className="my-2" src={`${CDNIMGURL2}weight-fat.png`} />
            <View className="text-24 mb-1">超重</View>
          </View>
        </View>
        <View
          className={
            `pet-health-desc mt-1 px-2 py-1 bg-color-gray rounded-full text-22 font-bold
              ${pet.recentPosture === PetPosture.Emaciated ? 'pet-thin' : pet.recentPosture === PetPosture.Standard ? 'pet-std' : 'pet-fat'}`}
        >
          {pet.recentPosture === PetPosture.Emaciated
            ? '偏瘦：轻薄脂肪覆盖，肋骨容易触及'
            : pet.recentPosture === PetPosture.Standard
            ? '正常：柔软脂肪覆盖，肋骨尚能触及'
            : '偏胖：较厚脂肪覆盖，肋骨难以触及'}
        </View>
        <View className="mt-2">
          <PetTitle>{pet.name}近期的成年目标体重<Text className="ml-1 text-22 text-gray-800">(kg)</Text></PetTitle>
        </View>
        <View className="mt-1 choose-other-breed flex items-center" onClick={() => setShow1(true)}>
          <Text className="text-28 mx-1 flex-1 font-bold">{pet.targetWeight ? pet.targetWeight : '请选择'}</Text>
          <Text className="rcciconfont rccicon-right text-34 mx-1" />
        </View>
      </> : null}
      
      <View className="pet-edit-btns">
        <View className="grid grid-cols-2">
          <Text className="btn-item" onClick={() => onStepChange(PetStep.STEP4)}>上一步</Text>
          <Text className="btn-item active" onClick={handleNext}>下一步</Text>
        </View>
      </View>

      <AtFloatLayout
        isOpened={show}
        onClose={() => setShow(false)}
      >
        <View className="upload-avatar">
          <View className="mt-2 text-28 font-bold text-center">选择爱宠近期体重（公斤）</View>
          <View>
            <PickerView
              value={val}
              onChange={handleChangeCurrentWeight}
            >
              <PickerViewColumn>
                {arr1.map(item => <View>{item}</View>)}
              </PickerViewColumn>
              <PickerViewColumn>
                {arr2.map(item => <View>{item}</View>)}
              </PickerViewColumn>
              <PickerViewColumn>
                {arr3.map(item => <View>{item}</View>)}
              </PickerViewColumn>
            </PickerView>
          </View>
          <View className="mb-3">
            <View onClick={() => setShow(false)} className="cancel-btn rounded-full text-center h-3 bg-color-primary text-32 text-white">确定</View>
          </View>
        </View>
      </AtFloatLayout>

      <AtFloatLayout
        isOpened={show1}
        onClose={() => setShow1(false)}
      >
        <View className="upload-avatar">
          <View className="mt-2 text-28 font-bold text-center">选择爱宠目标体重（公斤）</View>
          <View>
            <PickerView
              value={val1}
              onChange={handleChangeTargetWeight}
            >
              <PickerViewColumn>
                {arr1.map(item => <View>{item}</View>)}
              </PickerViewColumn>
              <PickerViewColumn>
                {arr2.map(item => <View>{item}</View>)}
              </PickerViewColumn>
              <PickerViewColumn>
                {arr3.map(item => <View>{item}</View>)}
              </PickerViewColumn>
            </PickerView>
          </View>
          <View className="mb-3">
            <View onClick={() => setShow1(false)} className="cancel-btn rounded-full text-center h-3 bg-color-primary text-32 text-white">确定</View>
          </View>
        </View>
      </AtFloatLayout>
    </View>
  );
}

export default Step5;
