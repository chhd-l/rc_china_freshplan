import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { AddressItem } from '@/components/consumer'
import { useState } from 'react'
import { Address } from '@/framework/types/consumer'
import { getAddresses } from '@/framework/api/consumer/address'
import routers from '@/routers'
import './index.less'

const AddRessManage = () => {
  const [addressList, setAddressList] = useState<Address[]>([])

  const getAddressList = async () => {
    const res = await getAddresses()
    setAddressList(res)
  }

  // Taro.useDidShow(() => {
  //   getAddressList()
  // })

  const updateIsDefault = (address, value) => {
    const curAddresses = addressList.map((item) => {
      if (item.id === address.id) {
        item.isDefault = value
      } else {
        item.isDefault = false
      }
      return item
    })
    setAddressList(curAddresses)
  }

  return (
    <View className="AddRessManage">
      <View className="index p-1 min-h-screen bg-gray-eee">
        {addressList.map((item: Address, key: number) => (
          <AddressItem
            key={key}
            addressInfo={item}
            delAddressSuccess={() => getAddressList()}
            isDefaultUpdateSuccess={updateIsDefault}
          />
        ))}
        <View className="mt-2 flex justify-center inline-block">
          <Button
            className="Botton bg-white px-1.5 py-1 mr-2 flex items-center text-gray-400"
            onClick={() => {
              Taro.navigateTo({
                url: routers.newAddress,
              })
            }}
          >
            <Text>+&nbsp; </Text>新增地址
          </Button>
        </View>
      </View>
    </View>
  )
}

export default AddRessManage
