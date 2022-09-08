import RessBG from '@/assets/img/ressBg.png'
import { AddressItem } from '@/components/consumer'
import { deleteAddress, getAddresses } from '@/framework/api/consumer/address'
import { updateSubscriptionAddress } from '@/framework/api/subscription/subscription'
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
  const [showDelTip, setShowDelTip] = useState(false)
  const [AddressId, setAddressId] = useState('')

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

  const delAddress = async () => {
    const res = await deleteAddress({
      id: AddressId,
    })
    setShowDelTip(false)
    if (res) {
      getAddressList()
    }
  }

  const handleChooseAddress = async (address: Address) => {
    if (router?.params?.method === 'select') {
      const pages = Taro.getCurrentPages()
      const current = pages[pages.length - 1]
      const eventChannel = current.getOpenerEventChannel()
      Taro.setStorageSync('select-address', true)
      eventChannel.emit('chooseAddress', Object.assign({}, address))
      Taro.navigateBack()
    } else if (router?.params?.subscriptionDetailsID) {
      delete address.consumerId
      delete address.isDefault
      delete address.storeId
      await updateSubscriptionAddress(router.params.subscriptionDetailsID, address)
      Taro.navigateBack()
    }
  }

  return (
    <View className="AddRessManage pb-[1.5rem]">
      <View className={`px-1 ${!addressList.length && 'pt-10'} pt-1`}>
        {addressList.length ? (
          addressList.map((item: Address, key: number) => (
            <AddressItem
              key={key}
              addressInfo={item}
              setShowDelTip={setShowDelTip}
              isDefaultUpdateSuccess={updateIsDefault}
              onSelectAddress={handleChooseAddress}
              setAddressId={setAddressId}
            />
          ))
        ) : (
          <View className="noOrders flex flex-col items-center justify-center">
            <Image className="noOrdersImage" src={RessBG} />
            <View className="mt-2 flex justify-center">
              <Text className="ml-0.5">汪汪~啥也没有!</Text>
            </View>
          </View>
        )}
        <View className="w-full pt-1 pb-2 fixed bottom-0 left-0 bg-white">
          <AtButton
            className="mx-4 rounded-full"
            type="primary"
            onClick={() => {
              Taro.navigateTo({
                url: routers.newAddress,
              })
            }}
          >
            新增地址
          </AtButton>
        </View>
      </View>

      {/* 弹出层 */}
      <View
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center"
        style={{
          display: showDelTip ? 'flex' : 'none',
        }}
        onClick={(e) => {
          e.stopPropagation()
          setShowDelTip(false)
        }}
      >
        <View>
          <View
            className="w-[650px] bg-white rounded-[50px] flex flex-col items-center"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Image className="mt-2" src={`${CDNIMGURL}pop.png`} style={{ width: '2.36rem', height: '2.36rem' }} />
            <View className="text-[29px] text-[#333] mt-2">您确定要删除这个地址吗？</View>
            <View className="flex items-center justify-between my-2">
              <AtButton
                circle
                className="w-[190px] h-[80px] leading-[80px] text-[28px] text-white m-0 border-0 bg-[#C8E399]"
                onClick={delAddress}
              >
                确定
              </AtButton>
              <AtButton
                circle
                className="w-[190px] h-[80px] leading-[80px] text-[28px] text-white m-0 border-0 bg-[#96CC39] ml-2"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDelTip(false)
                }}
              >
                取消
              </AtButton>
            </View>
          </View>
          <View className="flex justify-center mt-3">
            <Text className="rcciconfont rccicon-close text-white text-48" />
          </View>
        </View>
      </View>
    </View>
  )
}

export default AddRessManage
