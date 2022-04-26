import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { AddressItem } from '@/components/customer'
import { useState } from 'react'
import { Address } from '@/framework/types/customer'
import { getAddresses } from '@/framework/api/customer/address'
import routers from '@/routers'
import './index.less'

const Index = () => {
  const [addressList, setAddressList] = useState<Address[]>([])

  const getAddressList = async () => {
    const res = await getAddresses()
    setAddressList(res)
  }

  Taro.useDidShow(() => {
    getAddressList()
  })

  const getWechatAddress = () => {
    Taro.chooseAddress({
      success: async function (res) {
        console.log('微信地址', res)
        if (res) {
          const addressInfo = {
            receiverName: res.userName,
            phone: res.telNumber,
            province: res.provinceName,
            city: res.cityName,
            region: res.countyName,
            detail: res.detailInfo,
            postcode: res.postalCode,
            isDefault: false,
          }
          Taro.setStorage({
            key: 'current-wechat-address',
            data: JSON.stringify(addressInfo),
            success: function () {
              Taro.redirectTo({
                url: `${routers.newAddress}?type=addWechatAddress`,
              })
            },
          })
        }
      },
    })
  }

  return (
    <View style={{ backgroundColor: '#eeeeee' }} className="index p-2 min-h-screen">
      {addressList.map((item: Address) => (
        <AddressItem
          addressInfo={item}
          delAddressSuccess={() => getAddressList()}
          isDefaultUpdateSuccess={() => getAddressList()}
        />
      ))}
      <View className="m-0 flex flex-row items-center mt-2 h-20">
        <View className="flex flex-row m-auto border-none">
          <Button
            className="text-xs h-8 bg-white mr-3 flex items-center text-gray-400"
            onClick={() => {
              Taro.navigateTo({
                url: routers.newAddress,
              })
            }}
          >
            <Text>+</Text>新增地址
          </Button>
          <Button
            className="text-xs h-8 bg-white flex items-center text-gray-400 border-none"
            onClick={() => getWechatAddress()}
          >
            <Text>+</Text>获取微信收货地址
          </Button>
        </View>
      </View>
    </View>
  )
}

export default Index
