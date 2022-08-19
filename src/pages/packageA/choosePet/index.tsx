import Taro from "@tarojs/taro";
import { useState } from 'react';
import { useAtom } from 'jotai';
import { consumerAtom } from '@/store/consumer';
import { PetListItemProps } from '@/framework/types/consumer';
import { getPets } from '@/framework/api/pet/get-pets';
import { View, Image } from '@tarojs/components';
import RotationChartList from '@/components/RotationChartList'
import { CDNIMGURL2 } from '@/lib/constants';

import './index.less';

const ChoosePet = () => {
  const [petList, setPetList] = useState<PetListItemProps[]>([])
  const [consumer] = useAtom(consumerAtom);

  const getPetList = async (consumerId: string) => {
    const res = await getPets({ consumerId });
    setPetList(res ?? []);
    if (!res || res.length === 0) {
      Taro.redirectTo({
        url: '/pages/petEdit/index',
      })
    } else {
      Taro.setStorageSync("petItem", res[0]);
    }
  }

  Taro.useDidShow(() => {
    getPetList(consumer?.id ?? "");
  })

  const handleChoosedPet = (pet: PetListItemProps) => {
    console.log('choosed pet:', pet);
    Taro.setStorageSync("petItem", pet);
  }

  const handleRecom = () => {
    Taro.navigateTo({
      url: '/pages/foodRecom/index',
    })
  }

  return (
    <View className="py-1">
      <View className="my-1 px-1 text-34 font-bold">选择您的宠物！</View>
      <View className="px-1">
        <RotationChartList
          list={petList}
          onClickPetList={() => {
            Taro.navigateTo({ url: '/pages/packageA/petList/index' })
          }}
          onClickPetAdd={() => {
            Taro.navigateTo({ url: '/pages/packageA/petEdit/index' })
          }}
          onSelectPet={handleChoosedPet}
        />
      </View>
      <View className="mx-1 my-2 flex">
        <View
          className="text-30 px-1 py-0.8 text-white bg-color-primary rounded-full text-center"
          onClick={handleRecom}
        >
          推荐食谱
        </View>
      </View>
      <View>
        <Image className="w-full" mode="widthFix" src={`${CDNIMGURL2}cat-and-dog.png`} />
      </View>
    </View>
  )
}

export default ChoosePet;
