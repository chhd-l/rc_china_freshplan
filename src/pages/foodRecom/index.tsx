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
  const [list, setList] = useState<any[]>([]);
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
      setList((res2?.productList || []).map((item: any) => {
        item.subscriptionRecommendRuleId = ((res1?.productList ?? []).find(p => p?.productVariantInfo?.variants?.[0].id === item?.variants?.id) ?? {})['subscriptionRecommendRuleId'];
        return item;
      }).sort((a: any) => {
        if (a.subscriptionRecommendRuleId) {
          return -1;
        } else {
          return 1;
        }
      }));
      setRecommendProductNames((res2?.productList || []).reduce((prev: string[], curr: any) => {
        if (defaultSelected.indexOf(curr?.variants?.id) > -1) {
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
    const selectedItems = list.filter((t: any) => selected.indexOf(t?.variants?.id) > -1);
    if (!selectedItems || selectedItems.length === 0) {
      Taro.showToast({ title: '请选择套餐' });
    } else {
      Taro.setStorageSync("checkoutItems", selectedItems);
      Taro.redirectTo({
        url: '/pages/packageA/checkout/index',
      });
    }
  }

  // const total_price = list.reduce((prev: number, curr: any) => {
  //   if (selected.indexOf(curr?.variants?.id) > -1) {
  //     return prev + (curr?.variants?.subscriptionPrice ?? 0) * 6;
  //   } else {
  //     return prev;
  //   }
  // }, 0);

  return (
    <View className="pet-food-recom pt-2 pb-12">
      <View className="my-1 text-42 font-bold text-center">{pet?.name}的专属健康食谱</View>
      <View className="my-1 text-32 text-center">专家根据您的宠物信息推荐<Text className="text-color-primary">{recommendProductNames}</Text>套餐</View>
      <View className="my-1 text-28 light-gray-text text-center">最多选择<Text className="text-color-primary">两个</Text>套餐</View>
      <View className="pet-food-list mx-2 my-1">
        {list.map((item: any, idx: number) => (
          <View key={idx} className={`pet-food-item overflow-hidden my-1.5 ${selected.indexOf(item?.variants?.id) > -1 ? 'active' : ''}`} onClick={() => handleSelect(item?.variants?.id)}>
            <View className="flex items-center">
              <View className="image text-center">
                <Image src={item?.variants?.defaultImage}></Image>
              </View>
              <View className="flex-1 mx-1">
                <View className="text-36 font-bold my-2">{item?.name}</View>
                <View className="my-2 text-26 text-gray-400">{(item?.description ?? "").replace(/<[^>]+>/ig, "")}</View>
              </View>
            </View>
            <View className="rectangle">
              <Text className="rcciconfont rccicon-check text-color-primary"></Text>
            </View>
          </View>
        ))}
      </View>
      <View className="pet-food-footer">
        <View className="footer-btn mx-2 text-white text-34 bg-color-primary rounded-full" onClick={handleCheckout}>立即购买</View>
      </View>
    </View>
  );
}

export default FoodRecom;
