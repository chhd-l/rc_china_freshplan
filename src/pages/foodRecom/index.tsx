import { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { CDNIMGURL2 } from '@/lib/constants';
import { PetListItemProps } from '@/framework/types/consumer';
import { useAtom } from 'jotai';
import { consumerAtom } from '@/store/consumer';
import Taro from '@tarojs/taro';
import { getSubscriptionSimpleRecommend } from '@/framework/api/subscription/subscription';
import { getProducts } from '@/framework/api/product/get-product';
import { formatMoney } from '@/utils/utils';
import moment from 'moment';

import './index.less';

const FoodRecom = () => {
  const [consumer] = useAtom(consumerAtom);
  const [list, setList] = useState([]);
  const [pet, setPet] = useState<PetListItemProps | undefined>();
  const [selected, setSelected] = useState<string[]>([]);
  const [recommendProductNames, setRecommendProductNames] = useState('');

  Taro.useReady(() => {
    const data: PetListItemProps = Taro.getStorageSync("petItem");
    setPet(data);
    Promise.all([
      getSubscriptionSimpleRecommend({
        subscriptionType: 'FRESH_PLAN',
        petType: data.type,
        petBreedCode: data.code,
        isPetSterilized: data.isSterilized,
        petBirthday: moment(data.birthday),
        recentHealth: (data.recentHealth || []).join("|"),
      }),
      getProducts({ limit: 4, sample: { storeId: consumer?.storeId }, withTotal: true, offset: 0 })
    ]).then(([res1, res2]) => {
      const defaultSelected = (res1?.productList ?? []).map(p => p?.productVariantInfo?.variants?.[0].id);
      setSelected(defaultSelected);
      setList(res2?.productList || []);
      setRecommendProductNames((res2?.productList || []).reduce((prev: string[], curr: any) => {
        if (defaultSelected.indexOf(curr.sku) > -1) {
          prev.push(curr.name);
        }
        return prev;
      }, []).join("、"));
    });
  });

  const handleSelect = (key: string) => {
    const idx = selected.indexOf(key);
    if (idx > -1) {
      selected.splice(idx, 1);
    } else if (selected.length < 2) {
      selected.push(key);
    }
    setSelected(selected.slice());
  }

  const handleCheckout = () => {
    const selectedItems = list.filter((t: any) => selected.indexOf(t.sku) > -1);
    if (!selectedItems || selectedItems.length === 0) {
      Taro.showToast({ title: '请选择套餐' });
    } else {
      Taro.navigateTo({
        url: '/pages/packageA/checkout/index',
        success: (res) => {
          res.eventChannel.emit('checkoutItems', selectedItems);
        },
      });
    }
  }

  const total_price = list.reduce((prev: number, curr: any) => {
    if (selected.indexOf(curr.sku) > -1) {
      return prev + curr.price;
    } else {
      return prev;
    }
  }, 0);

  return (
    <View className="pet-food-recom pt-2 pb-12">
      <View className="my-1 text-32 font-bold text-center">{pet?.name}的专属健康食谱</View>
      <View className="my-1 text-28 text-center">专家根据您的宠物信息推荐<Text className="text-color-primary">{recommendProductNames}</Text>套餐</View>
      <View className="my-1 text-22 light-gray-text text-center">最多选择<Text className="text-color-primary">两个</Text>套餐</View>
      <View className="pet-food-list mx-2 my-1">
        {list.map((item: any, idx: number) => (
          <View key={idx} className={`pet-food-item my-1 py-2 ${selected.indexOf(item.sku) > -1 ? 'active' : ''}`} onClick={() => handleSelect(item.sku)}>
            <View className="image mx-4 text-center">
              <Image src={item.img}></Image>
            </View>
            <View className="my-1 mx-2 flex items-end">
              <Text className="name text-28 font-bold">{item.name}</Text>
              <Text className="price ml-1 text-22">{formatMoney(item.price)}</Text>
            </View>
            <View className="mx-2 text-22 text-gray-400">{(item?.description ?? "").replaceAll(/<[^>]+>/ig, "")}</View>
            <View className="rectangle">
              <Text className="rcciconfont rccicon-check text-color-primary"></Text>
            </View>
          </View>
        ))}
      </View>
      <View className="pet-food-footer">
        <View className="mx-2 flex justify-between items-center">
          <View className="text-28">合计：<Text className="price">{formatMoney(total_price)}</Text></View>
          <View className="px-2 py-0.8 text-white text-28 bg-color-primary rounded-full" onClick={handleCheckout}>立即下单</View>
        </View>
      </View>
    </View>
  );
}

export default FoodRecom;
