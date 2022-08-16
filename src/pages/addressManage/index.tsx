import { AddressItem } from '@/components/consumer'
import { getAddresses } from '@/framework/api/consumer/address'
import { Address } from '@/framework/types/consumer'
import { CDNIMGURL } from '@/lib/constants'
import routers from '@/routers'
import { Image, Text, View } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { useState } from 'react'
import { AtButton } from 'taro-ui'
import './index.less'

const AddRessManage = () => {
  const [addressList, setAddressList] = useState<Address[]>([])
  const { router } = getCurrentInstance()

  const getAddressList = async () => {
    const res = await getAddresses()
    setAddressList(res)
  }

  Taro.useDidShow(() => {
    getAddressList()
  })

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

  const handleChooseAddress = (address: Address) => {
    if (router?.params?.method === 'select') {
      const pages = Taro.getCurrentPages()
      const current = pages[pages.length - 1]
      const eventChannel = current.getOpenerEventChannel()
      eventChannel.emit('chooseAddress', Object.assign({}, address));
      Taro.navigateBack()
    }
  }

  return (
    <View className="AddRessManage">
      <View className={`px-1 ${!addressList.length && 'pt-10'} pb-1`}>
        {addressList.length ? (
          addressList.map((item: Address, key: number) => (
            <AddressItem
              key={key}
              addressInfo={item}
              delAddressSuccess={() => getAddressList()}
              isDefaultUpdateSuccess={updateIsDefault}
              onSelectAddress={handleChooseAddress}
            />
          ))
        ) : (
          <View className="noOrders flex flex-col items-center justify-center">
            <Image className="noOrdersImage" src={`${CDNIMGURL}Empty%20orders.png`} />
            <View className="mt-2 flex justify-center">
              <Text className="ml-0.5">汪汪~啥也没有!</Text>
            </View>
          </View>
        )}
        <View className="w-full pt-1 pb-3 fixed bottom-0 left-0 bg-white">
          <AtButton
            className="mx-4 rounded-full"
            type="primary"
            onClick={() => {
              Taro.navigateTo({
                url: routers.newAddress,
              })
            }}
          >
            +&nbsp; 新增地址
          </AtButton>
        </View>
      </View>
    </View>
  )
}

export default AddRessManage
