import { View, Text, Image, Input } from '@tarojs/components';
import { Address } from '@/framework/types/consumer';
import { getAddresses } from '@/framework/api/consumer/address';
import { subscriptionCreateAndPay } from '@/framework/api/subscription/subscription';
import { calculateOrderPrice } from '@/framework/api/order';
import { useState, useEffect } from 'react';
import { formatMoney } from '@/utils/utils';
import Taro from '@tarojs/taro';
import moment from 'moment';

import './index.less';

const Checkout = () => {
  const [address, setAddress] = useState<Address | undefined>();
  const [items, setItems] = useState<any[]>([]);
  const [prices, setPrices] = useState<any>({});
  const [remark, setRemark] = useState<string>("");

  const getAddressList = async () => {
    const res: Address[] = await getAddresses()
    setAddress(res.find(addr => addr.isDefault));
  }

  Taro.useReady(() => {
    const data: any = Taro.getStorageSync("checkoutItems");
    setItems(data);
    calculateOrderPrice({
      orderItems: data,
      voucher: null,
      subscriptionType: "FRESH_PLAN",
      subscriptionCycle: null,
      isWXGroupVip: null,
    }).then(res => {
      setPrices(res)
    });
    getAddressList();
  });

  const handleChooseAddress = () => {
    Taro.navigateTo({
      url: `/pages/packageA/addressManage/index?method=select`,
      events: {
        chooseAddress: function (address: Address) {
          console.log('choosed address---', address)
          //let newPetInfo = Object.assign({}, pet, { breed, code })
          setAddress(address);
        },
      },
    })
  }

  const handlePayment = async () => {
    const pet: any = Taro.getStorageSync("petItem");
    const res: any = await subscriptionCreateAndPay({
      orderItems: items,
      address,
      remark,
      deliveryTime: moment().add(1, 'days').format('YYYY-MM-DD'),
      pet,
    });
    console.log("payment result:", res);
    // Taro.redirectTo({
    //   url: '/pages/packageA/elencoOrdini/index?status=ALL',
    // })
  }

  const subtotal = items.reduce((prev: number, curr: any) => {
    return prev + (curr?.variants?.subscriptionPrice ?? 0);
  }, 0);

  // const nextThursday = moment().isoWeekday() < 4 ? moment().isoWeekday(4).format('YYYY-MM-DD') : moment().add(1, 'weeks').isoWeekday(4).format('YYYY-MM-DD');

  return (
    <View className="checkout-page pt-2 pb-8">

      <View className="bg-white rounded-sm mx-1 py-1 px-1">
        <View className="flex justify-between items-center" onClick={handleChooseAddress}>
          {address?.id ? <View className="flex-1">
            <View className="text-28">{address?.province}{address?.city}{address?.region}</View>
            <View className="text-30 font-bold mt-0.5">{address?.detail}</View>
            <View className="text-28 mt-0.5">{address?.receiverName} {address?.phone}</View>
          </View> : <View className="py-1 flex items-center">
            <Text className="rcciconfont rccicon-location text-32"></Text>
            <Text className="ml-1 text-30 font-bold">添加收获地址</Text>
          </View>}
          <Text className="rcciconfont rccicon-right text-22 text-gray-400"></Text>
        </View>
      </View>

      <View className="bg-white rounded-sm mx-1 mt-1">
        <View className="food-list p-1">
          {items.map((item: any, idx: number) => (
            <View key={idx} className="food-item p-1 flex items-center">
              <View className="w-8 h-8">
                <Image src={item?.variants?.defaultImage} />
              </View>
              <View className="flex-1 ml-1">
                <View className="text-30">{item?.name}</View>
                <View className="mt-0.5 text-24 text-color-price">{formatMoney(item?.variants?.subscriptionPrice)}</View>
                <View className="mt-2 text-24 text-gray-400 text-right">X 1</View>
              </View>
            </View>
          ))}
        </View>
        <View className="p-1">
          <View className="flex justify-between items-center">
            <Text className="text-30">运费</Text>
            <Text className="text-30 font-bold">{formatMoney(prices?.deliveryPrice ?? 0)}</Text>
          </View>
          <View className="mt-1 text-right">
            <Text className="text-30 text-gray-400">商品小计：</Text>
            <Text className="text-30 text-color-price font-bold">{formatMoney(prices?.productPrice ?? 0)}</Text>
          </View>
        </View>
      </View>

      <View className="bg-white rounded-sm mx-1 mt-1 p-1">
        <View className="flex justify-between items-center text-30">
          <Text>商品金额</Text>
          <Text>{formatMoney(subtotal)}</Text>
        </View>
        <View className="mt-2 flex justify-between items-center text-30">
          <Text>运费</Text>
          <Text>{formatMoney(prices?.deliveryPrice ?? 0)}</Text>
        </View>
        <View className="mt-1 border border-solid border-gray-100"></View>
        <View className="mt-1 text-right">
          <Text className="text-30">合计：</Text>
          <Text className="text-30 text-color-price font-bold">{formatMoney(prices?.totalPrice ?? 0)}</Text>
        </View>
      </View>

      <View className="bg-white rounded-sm mx-1 mt-1 p-1 flex items-center">
        <View className="mr-1 text-30">买家留言</View>
        <View className="flex-1">
          <Input value={remark} onInput={(e) => setRemark(e.detail.value)} className="rcc-input bg-white text-right text-30" placeholder="留言建议提前协商 (250字内)" />
        </View>
      </View>

      <View className="bg-white rounded-sm mx-1 mt-1 p-1">
        <View className="flex items-center">
          <Text className="mr-1 rcciconfont rccicon-ontime text-color-primary text-30" />
          <Text className="flex-1 text-28 text-gray-400">我们将每四周扣款发货一次，请注意!</Text>
        </View>
        <View className="mt-1 flex items-center">
          <Text className="mr-1 rcciconfont rccicon-ship text-color-primary text-28" />
          <Text className="flex-1 text-28 text-gray-400">本次订单将在{moment().add(1, 'days').format('YYYY-MM-DD')}发货，请注意查收!</Text>
        </View>
      </View>

      <View className="pet-food-footer">
        <View className="mx-2 flex justify-between items-center">
          <View className="text-32">应付：<Text className="font-bold text-color-price">{formatMoney(prices?.totalPrice ?? 0)}</Text></View>
          <View className="px-4 py-0.8 text-white text-32 bg-color-primary rounded-full" onClick={handlePayment}>支 付</View>
        </View>
      </View>

    </View>
  );
}

export default Checkout;
