import { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { getBreedList } from '@/framework/api/pet/get-breeds';
import { BreedListItemProps } from '@/pages/packageA/breedList';
import { PetStep, PetListItemProps } from '@/framework/types/consumer';
import PetTitle from './components/PetTitle';
import { IProps } from './step1';
import Taro from '@tarojs/taro';

import './step.less';

interface IProps3 extends IProps {
  onChangeAll: (obj: Partial<PetListItemProps>) => void;
}

const Step3 = ({ pet, onStepChange, onChangeAll }: IProps3) => {
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
      url: `/pages/packageA/breedList/index?type=${pet.type}`,
      events: {
        seachBreed: function ({ breed, code }) {
          console.log('返回的数据---', breed, code)
          //let newPetInfo = Object.assign({}, pet, { breed, code })
          onChangeAll({ breed, code });
          onStepChange(PetStep.STEP4);
        },
      },
    })
  }

  const handleChooseBreed = (breed: string, code: string) => {
    console.log('xxxxxxx', breed, code);
    onChangeAll({ breed, code });
    onStepChange(PetStep.STEP4);
  }

  // const handleNext = () => {
  //   if (!pet.code) {
  //     Taro.showToast({ title: '请先选择品种' });
  //   } else {
  //     onStepChange(PetStep.STEP4);
  //   }
  // }

  const hotBreedList = breedList.filter(el => el.isHot).filter((el, idx) => idx < 9);
  const isOtherBreedSelected = !!pet.code && hotBreedList.map(el => el.code).indexOf(pet.code) === -1;

  return (
    <View className="mx-1 pt-2">
      <View className="mt-2">
        <PetTitle>{pet.name}的品种是</PetTitle>
      </View>
      <View className="mt-2 rcc-single-choice grid grid-cols-3">
        {hotBreedList.map((item: BreedListItemProps, index: number) => (
            <Text
              key={index}
              className={`rcc-choice-item text-28 font-bold truncate ${pet.code === item.code ? 'active' : ''}`}
              onClick={() => handleChooseBreed(item.name, item.code)}
            >
              {item.name}
            </Text>
        ))}
      </View>
      <View className={`mt-1 choose-other-breed flex items-center ${isOtherBreedSelected ? 'active' : ''}`} onClick={handleBreed}>
        <Text className="text-28 mx-1 flex-1 font-bold">{isOtherBreedSelected ? pet.breed : '选择其他品种'}</Text>
        <Text className="rcciconfont rccicon-right text-34 mx-1" />
      </View>
      <View className="pet-edit-btns">
        <View className="grid grid-cols-2">
          <Text className="btn-item" onClick={() => onStepChange(PetStep.STEP2)}>上一步</Text>
        </View>
      </View>
    </View>
  );
}

export default Step3;
