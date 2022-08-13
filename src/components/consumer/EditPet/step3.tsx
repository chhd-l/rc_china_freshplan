import { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { getBreedList } from '@/framework/api/pet/get-breeds';
import { BreedListItemProps } from '@/pages/breedList';
import { PetStep } from '@/framework/types/consumer';
import PetTitle from './components/PetTitle';
import { IProps } from './step1';
import Taro from '@tarojs/taro';

import './step.less';

const Step3 = ({ pet, onStepChange, onChange }: IProps) => {
  const [breedList, setBreedList] = useState<BreedListItemProps[]>([]);

  const getList = async () => {
    let res = await getBreedList()
    my.setStorageSync({ key: 'breedList', data: res });
    let type = pet?.type ? pet?.type : 'CAT';
    res = res.filter((el) => el.type === type)
    setBreedList(res)    
  }

  useEffect(() => {
    getList()
  }, [])

  const handleBreed = () => {
    Taro.navigateTo({
      url: `/pages/breedList/index?type=${pet.type}`,
      events: {
        seachBreed: function ({ breed, code }) {
          console.log('返回的数据---', breed, code)
          //let newPetInfo = Object.assign({}, pet, { breed, code })
          onChange('breed', breed);
          onChange('code', code);
        },
      },
    })
  }

  const handleChooseBreed = (breed: string, code: string) => {
    console.log('xxxxxxx', breed);
    onChange('breed', breed);
    onChange('code', code);
  }

  console.log('now pet:', pet);

  return (
    <View className="mx-1 mt-2">
      <View className="mt-4">
        <PetTitle>{pet.name}的品种是</PetTitle>
      </View>
      <View className="mt-2 rcc-single-choice grid grid-cols-3">
        {breedList
          .filter((el: BreedListItemProps) => el.isHot)
          .filter((el, idx) => idx < 9)
          .map((item: BreedListItemProps, index: number) => (
            <Text
              key={index}
              className={`rcc-choice-item text-28 font-bold ${pet.breed === item.name ? 'active' : ''}`}
              onClick={() => handleChooseBreed(item.name, item.code)}
            >
              {item.name}
            </Text>
        ))}
      </View>
      <View className="mt-1 choose-other-breed flex items-center" onClick={handleBreed}>
        <Text className="text-28 mx-2 flex-1 font-bold">选择其它品种</Text>
        <Text className="rcciconfont rccicon-right text-34 mx-2" />
      </View>
      <View className="pet-edit-btns">
        <View className="grid grid-cols-2">
          <Text className="btn-item" onClick={() => onStepChange(PetStep.STEP2)}>上一步</Text>
          <Text className="btn-item active" onClick={() => onStepChange(PetStep.STEP4)}>下一步</Text>
        </View>
      </View>
    </View>
  );
}

export default Step3;
