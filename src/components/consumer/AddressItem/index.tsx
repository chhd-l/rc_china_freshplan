import { deleteAddress, updateAddress } from '@/framework/api/consumer/address'
import { Address } from '@/framework/types/consumer'
import { CDNIMGURL } from '@/lib/constants'
import routers from '@/routers'
import { Image, Text, View } from '@tarojs/components'
import Taro, { getCurrentPages } from '@tarojs/taro'
import { useState } from 'react'
import { AtCheckbox, AtModal } from 'taro-ui'
import './index.less'

const AddressItem = ({
  addressInfo,
  delAddressSuccess,
  isDefaultUpdateSuccess,
}: {
  addressInfo: Address
  delAddressSuccess: Function
  isDefaultUpdateSuccess: Function
}) => {
  const [showDelTip, setShowDelTip] = useState(false)
  const { receiverName, phone, province, city, region, detail } = addressInfo

  const editAddress = () => {
    Taro.setStorage({
      key: 'current-address',
      data: JSON.stringify(addressInfo),
      success: function () {
        Taro.navigateTo({
          url: `${routers.newAddress}?type=edit`,
        })
      },
    })
  }

  const delAddress = async () => {
    const res = await deleteAddress({
      id: addressInfo.id || '',
    })
    setShowDelTip(false)
    if (res) {
      delAddressSuccess && delAddressSuccess()
    }
  }

  const setAsDefault = async () => {
    const value = !addressInfo.isDefault
    if (value) {
      const res = await updateAddress({
        params: {
          consumerId: addressInfo.consumerId,
          id: addressInfo.id,
          isDefault: !addressInfo.isDefault,
        },
      })
      if (res) {
        isDefaultUpdateSuccess && isDefaultUpdateSuccess(addressInfo, !addressInfo.isDefault)
      }
    } else {
      //不允许将默认地址设置成非默认地址
      return false
    }
  }

  //checkout过来勾选地址
  const selectAddress = () => {
    const findCheckoutIndex = getCurrentPages().findIndex((el) => {
      console.log(el.route)
      return el.route === routers.checkout.replace('/', '')
    })
    if (findCheckoutIndex > -1) {
      Taro.getStorage({
        key: 'address-from-checkout',
        success: function (data) {
          console.info('datadatadata', data)
          if (data.data) {
            Taro.setStorage({
              key: 'select-address',
              data: JSON.stringify(addressInfo),
              success: function (res) {
                console.log(res)
                Taro.navigateBack()
              },
            })
            Taro.removeStorageSync('address-from-checkout')
          }
        },
      })
    }
  }

  return (
    <View className="p-1 bg-white mt-1 rounded AddressItem">
      <View onClick={selectAddress}>
        <View className="flex flex-row justify-between">
          <Text className="text-black font-semibold">{receiverName}</Text>
          <Text className="text-gray-400">{phone}</Text>
        </View>
        <View className="mt-1 pb-1" style={{ borderBottom: '1px solid #D8D8D8' }}>
          <Text className="">
            {province} {city} {region} {detail}
          </Text>
        </View>
      </View>
      <View className="flex flex-row justify-between items-center">
        <View>
          <AtCheckbox
            options={[{ label: '默认地址', value: true }]}
            selectedList={[addressInfo.isDefault]}
            onChange={setAsDefault}
          />
        </View>
        <View className="flex flex-row items-center">
          <Image style={{ width: '26px', height: '26px' }} src={`${CDNIMGURL}edit_address.png`} onClick={editAddress} />
          <Image
            className="ml-1"
            style={{ width: '20px', height: '24px' }}
            src={`${CDNIMGURL}remove_address.png`}
            onClick={() => {
              setShowDelTip(true)
            }}
          />
        </View>
      </View>
      <AtModal
        isOpened={showDelTip}
        title="提示"
        content="确定删除地址信息？"
        cancelText="再想想"
        confirmText="狠心删除"
        onClose={() => {
          setShowDelTip(false)
        }}
        onCancel={() => {
          setShowDelTip(false)
        }}
        onConfirm={() => delAddress()}
        className="rc_modal"
      />
    </View>
  )
}
export default AddressItem
