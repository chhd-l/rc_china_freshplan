import { View, Text, Image, Textarea } from '@tarojs/components'
import { AtTextarea } from 'taro-ui'
import { Address } from '@/framework/types/consumer'
import { addPet } from '@/framework/api/pet/add-pet'
import { getAddresses } from '@/framework/api/consumer/address'
import { subscriptionCreateAndPay } from '@/framework/api/subscription/subscription'
import { calculateOrderPrice } from '@/framework/api/order'
import { useState } from 'react'
import { formatMoney } from '@/utils/utils'
import Taro from '@tarojs/taro'
import moment from 'moment'

import './index.less'

const Checkout = () => {
  const [address, setAddress] = useState<Address | undefined>()
  const [items, setItems] = useState<any[]>([])
  const [prices, setPrices] = useState<any>({})
  const [remark, setRemark] = useState<string>('')

  const getAddressList = async () => {
    const reflag = Taro.getStorageSync('select-address')
    if (!reflag) {
      const res: Address[] = await getAddresses()
      if (address?.id && res.findIndex((addr) => addr.id === address.id) > -1) {
        setAddress(res.find((addr) => addr.id === address.id))
      } else {
        setAddress(res.find((addr) => addr.isDefault) || res[0])
      }
    }
  }

  Taro.useReady(() => {
    const data: any = Taro.getStorageSync('checkoutItems')
    setItems(data)
    calculateOrderPrice({
      orderItems: data,
      voucher: null,
      subscriptionType: 'FRESH_PLAN',
      subscriptionCycle: null,
      isWXGroupVip: null,
    }).then((res) => {
      setPrices(res)
    })
  })

  Taro.useDidShow(() => {
    getAddressList()
  })

  Taro.useDidHide(() => {
    Taro.removeStorageSync('select-address')
  })

  const handleChooseAddress = () => {
    Taro.navigateTo({
      url: `/pages/packageA/addressManage/index?method=select`,
      events: {
        chooseAddress: function (address: Address) {
          console.log('choosed address---', address)
          //let newPetInfo = Object.assign({}, pet, { breed, code })
          setAddress(address)
        },
      },
    })
  }

  const handlePayment = async () => {
    if (!address?.id) {
      Taro.showToast({ title: '请先选择收货地址' })
      return
    }
    Taro.showLoading()
    const pet: any = Taro.getStorageSync('petItem')
    // 如果有pet有id，说明是详情页过来的，不执行添加宠物操作
    const addPetRes = pet.id && pet.id !== '-1' ? { id: pet.id } : await addPet(pet)
    if (addPetRes?.id) {
      const res: any = await subscriptionCreateAndPay({
        orderItems: items,
        address,
        remark,
        deliveryTime: moment().format('YYYY-MM-DD'),
        pet: { ...pet, id: addPetRes.id },
      })
      Taro.hideLoading()
      console.log('payment result:', res)
      // Taro.redirectTo({
      //   url: '/pages/packageA/elencoOrdini/index?status=ALL',
      // })
    } else {
      Taro.hideLoading()
    }
  }

  // const subtotal = items.reduce((prev: number, curr: any) => {
  //   return prev + (curr?.variants?.subscriptionPrice ?? 0);
  // }, 0);

  // const nextThursday = moment().isoWeekday() < 4 ? moment().isoWeekday(4).format('YYYY-MM-DD') : moment().add(1, 'weeks').isoWeekday(4).format('YYYY-MM-DD');

  return (
    <View className="checkout-page pt-2 pb-8">
      <View className="bg-white rounded-sm mx-1 py-1 px-1">
        <View className="flex justify-between items-center" onClick={handleChooseAddress}>
          {address?.id ? (
            <View className="flex-1">
              <View className="text-28 font-bold">
                {address?.province}
                {address?.city}
                {address?.region}
              </View>
              <View className="text-30 mt-0.5">{address?.detail}</View>
              <View className="text-28 font-bold mt-0.5">
                {address?.receiverName} {address?.phone}
              </View>
            </View>
          ) : (
            <View className="py-1 flex items-center">
              <Text className="rcciconfont rccicon-location text-32"></Text>
              <Text className="ml-1 text-30 font-bold">添加收货地址</Text>
            </View>
          )}
          <Text className="rcciconfont rccicon-right text-22 text-gray-400"></Text>
        </View>
      </View>

      <View className="bg-white rounded-sm mx-1 mt-1">
        <View className="text-30 p-1">订单商品</View>
        <View className="food-list px-1">
          {items.map((item: any, idx: number) => (
            <View key={idx} className="food-item my-1 flex items-start">
              <View className="w-8 h-8 overflow-hidden border border-solid rounded-sm border-gray-100">
                <Image src={item?.variants?.defaultImage} />
              </View>
              <View className="flex-1 ml-1">
                <View className="my-1 flex justify-between items-center">
                  <View className="text-30 font-bold">{item?.name}</View>
                  <View className="text-24 text-gray-400 text-right">X 6</View>
                </View>
                <View className="text-28 text-gray-400">{formatMoney(item?.variants?.subscriptionPrice)}</View>
              </View>
            </View>
          ))}
        </View>
        <View className="p-1">
          <View className="text-right">
            <Text className="text-[28px]">商品小计：</Text>
            <Text className="text-30 text-color-price font-bold">{formatMoney(prices?.productPrice ?? 0)}</Text>
          </View>
        </View>
      </View>

      <View className="bg-white rounded-sm mx-1 mt-1 p-1">
        <View className="flex justify-between items-center text-30">
          <Text className="text-30 text-gray-400">商品金额</Text>
          <Text>{formatMoney(prices?.productPrice ?? 0)}</Text>
        </View>
        <View className="mt-2 flex justify-between items-center text-30">
          <Text className="text-30 text-gray-400">运费</Text>
          <Text>{formatMoney(prices?.deliveryPrice ?? 0)}</Text>
        </View>
        <View className="total-price-container mt-1 pt-1 text-right">
          <Text className="text-30">合计：</Text>
          <Text className="text-30 text-color-price font-bold">{formatMoney(prices?.totalPrice ?? 0)}</Text>
        </View>
      </View>

      <View className="bg-white rounded-sm mx-1 mt-1 p-1 flex items-start">
        <View className="mr-1 text-30 text-gray-400" style={{ paddingTop: '0.1rem' }}>
          买家留言
        </View>
        <View className="flex-1">
          <Textarea
            style={{ paddingBottom: 0, height: remark.length > 0 ? 'auto' : '.5rem' }}
            autoHeight={remark.length > 0}
            value={remark}
            onInput={(e) => setRemark(e.detail.value)}
            className="bg-white text-right text-30"
            placeholder="留言建议提前协商 (250字内)"
            maxlength={-1}
          />
        </View>
      </View>

      <View className="bg-white rounded-sm mx-1 mt-1 p-1">
        <View className="flex items-center">
          <Text className="mr-1 rcciconfont rccicon-ontime text-color-primary text-30" />
          <Text className="flex-1 text-28 text-gray-400">我们将每四周扣款发货一次，请注意!</Text>
        </View>
        <View className="mt-1 flex items-center">
          <Text className="mr-1 rcciconfont rccicon-ship text-color-primary text-28" />
          <Text className="flex-1 text-28 text-gray-400">
            本次订单将在{moment().add(1, 'days').format('YYYY-MM-DD')}发货，请注意查收!
          </Text>
        </View>
      </View>

      <View className="pet-food-footer">
        <View className="mx-2 flex justify-between items-center">
          <View className="text-32">
            应付：<Text className="font-bold text-color-price">{formatMoney(prices?.totalPrice ?? 0)}</Text>
          </View>
          <View className="footer-btn px-4 text-white text-32 bg-color-primary rounded-full" onClick={handlePayment}>
            支 付
          </View>
        </View>
      </View>
    </View>
  )
}

export default Checkout
