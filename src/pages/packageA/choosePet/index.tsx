import Taro from "@tarojs/taro";
import { useState } from 'react';
import { useAtom } from 'jotai';
import { consumerAtom } from '@/store/consumer';
import { PetListItemProps } from '@/framework/types/consumer';
import { getPets } from '@/framework/api/pet/get-pets';
import { View, Image } from '@tarojs/components';
import { AtList } from 'taro-ui';
// import RotationChartList from '@/components/RotationChartList';
import PetNavigation from "@/components/PetNavigation";
import { CDNIMGURL2 } from '@/lib/constants';
import { getAge } from '@/utils/utils';

import './index.less';

const ChoosePet = () => {
  const [petList, setPetList] = useState<PetListItemProps[]>([])
  const [pet, setPet] = useState<PetListItemProps | undefined>()
  const [consumer] = useAtom(consumerAtom);

  const getPetList = async (consumerId: string) => {
    const res = await getPets({ consumerId });
    const pets: PetListItemProps[] = [];
    (res ?? []).forEach((item: PetListItemProps) => {
      if ((item.subscriptionNo ?? []).length === 0) {
        item.age = getAge(item.birthday);
        pets.push(item);
      }
    });
    setPetList(pets);
    if (pets.length === 0) {
      Taro.setStorageSync("add-pet-first", 0); //从推荐进入，先进行推荐，再添加宠物
      Taro.redirectTo({
        url: '/pages/packageA/petEdit/index',
      })
    } else {
      setPet(pets[0]);
      Taro.setStorageSync("petItem", pets[0]);
    }
  }

  Taro.useDidShow(() => {
    getPetList(consumer?.id ?? "");
  })

  const handleChoosedPet = (pet: PetListItemProps) => {
    console.log('choosed pet:', pet);
    setPet(pet);
    Taro.setStorageSync("petItem", pet);
  }

  const handleRecom = () => {
    Taro.navigateTo({
      url: '/pages/foodRecom/index',
    })
  }

  return (
    <View className="choose-pet py-1">
      <View className="my-1 px-1 text-34 font-bold">选择您的宠物！</View>
      <View className="mx-1 rounded-sm block-boxshadow overflow-hidden">
        <AtList hasBorder={false}>
          <View 
            className="p-1 flex items-center"
            onClick={() => {
              Taro.setStorageSync("add-pet-first", 0); //从推荐进入，先进行推荐，再添加宠物
              Taro.navigateTo({ url: '/pages/packageA/petEdit/index' })
            }}
          >
            <View className="w-[50px] h-[50px]">
              <Image src={`${CDNIMGURL2}pet-foot.png`} mode="widthFix" />
            </View>
            <View className="flex-1 ml-0.5 text-28 font-bold">我的宠物</View>
            <View className="mr-0.5 text-26 text-gray-400">添加宠物</View>
            <View className="rcciconfont rccicon-right text-28 text-gray-400" />
          </View>
          <View className="p-1">
            <PetNavigation
              petList={petList}
              hasAdd={false}
              hasSelect={true}
              onSelect={handleChoosedPet}
              selectedPetId={pet?.id}
            />
          </View>
        </AtList>
        {/* <RotationChartList
          list={petList}
          onClickPetList={() => {
            Taro.navigateTo({ url: '/pages/packageA/petList/index' })
          }}
          onClickPetAdd={() => {
            Taro.navigateTo({ url: '/pages/packageA/petEdit/index' })
          }}
          onSelectPet={handleChoosedPet}
        /> */}
      </View>
      <View className="mx-1 my-2 flex">
        <View
          className="text-30 px-2 py-0.8 text-white bg-color-primary rounded-full text-center"
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
