import { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { CDNIMGURL2 } from '@/lib/constants';

import './index.less';

const FoodRecom = () => {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = (key: string) => {
    const idx = selected.indexOf(key);
    if (idx > -1) {
      selected.splice(idx, 1);
    } else if (selected.length < 2) {
      selected.push(key);
    }
    setSelected(selected.slice());
  }

  return (
    <View className="pet-food-recom py-2">
      <View className="my-1 text-32 font-bold text-center">xx的专属健康食谱</View>
      <View className="my-1 text-28 text-center">专家根据您的宠物信息推荐<Text className="text-color-primary">牛肉泥</Text>套餐</View>
      <View className="my-1 text-22 light-gray-text text-center">最多选择<Text className="text-color-primary">两个</Text>套餐</View>
      <View className="pet-food-list mx-2 my-1">
        <View className={`pet-food-item my-1 py-2 ${selected.indexOf('1') > -1 ? 'active' : ''}`} onClick={() => handleSelect('1')}>
          <View className="image mx-4 text-center">
            <Image src={`${CDNIMGURL2}food-1.png`}></Image>
          </View>
          <View className="my-1 mx-2 flex items-end">
            <Text className="name text-28 font-bold">牛肉泥</Text>
            <Text className="price ml-1 text-22">￥129.00</Text>
          </View>
          <View className="mx-2 text-22 text-gray-400">牛肉、土豆、鸡蛋、胡萝卜、豌豆</View>
          <View className="rectangle">
            <Text className="rcciconfont rccicon-check text-color-primary"></Text>
          </View>
        </View>
        <View className={`pet-food-item my-1 py-2 ${selected.indexOf('2') > -1 ? 'active' : ''}`} onClick={() => handleSelect('2')}>
          <View className="image mx-4 text-center">
            <Image src={`${CDNIMGURL2}food-2.png`}></Image>
          </View>
          <View className="my-1 mx-2 flex items-end">
            <Text className="name text-28 font-bold">牛肉泥</Text>
            <Text className="price ml-1 text-22">￥129.00</Text>
          </View>
          <View className="mx-2 text-22 text-gray-400">牛肉、土豆、鸡蛋、胡萝卜、豌豆</View>
          <View className="rectangle">
            <Text className="rcciconfont rccicon-check text-color-primary"></Text>
          </View>
        </View>
        <View className={`pet-food-item my-1 py-2 ${selected.indexOf('3') > -1 ? 'active' : ''}`} onClick={() => handleSelect('3')}>
          <View className="image mx-4 text-center">
            <Image src={`${CDNIMGURL2}food-3.png`}></Image>
          </View>
          <View className="my-1 mx-2 flex items-end">
            <Text className="name text-28 font-bold">牛肉泥</Text>
            <Text className="price ml-1 text-22">￥129.00</Text>
          </View>
          <View className="mx-2 text-22 text-gray-400">牛肉、土豆、鸡蛋、胡萝卜、豌豆</View>
          <View className="rectangle">
            <Text className="rcciconfont rccicon-check text-color-primary"></Text>
          </View>
        </View>
        <View className={`pet-food-item my-1 py-2 ${selected.indexOf('4') > -1 ? 'active' : ''}`} onClick={() => handleSelect('4')}>
          <View className="image mx-4 text-center">
            <Image src={`${CDNIMGURL2}food-4.png`}></Image>
          </View>
          <View className="my-1 mx-2 flex items-end">
            <Text className="name text-28 font-bold">牛肉泥</Text>
            <Text className="price ml-1 text-22">￥129.00</Text>
          </View>
          <View className="mx-2 text-22 text-gray-400">牛肉、土豆、鸡蛋、胡萝卜、豌豆</View>
          <View className="rectangle">
            <Text className="rcciconfont rccicon-check text-color-primary"></Text>
          </View>
        </View>
      </View>
      <View className="pet-food-footer">
        <View className="mx-2 flex justify-between items-center">
          <View className="text-28">合计：<Text className="price">￥129.00</Text></View>
          <View className="px-2 py-1 text-white text-24 bg-color-primary rounded-full">立即下单</View>
        </View>
      </View>
    </View>
  );
}

export default FoodRecom;
