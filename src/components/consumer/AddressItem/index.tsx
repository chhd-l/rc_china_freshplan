import { deleteAddress, updateAddress } from '@/framework/api/consumer/address'
import { Address } from '@/framework/types/consumer'
import { CDNIMGURL } from '@/lib/constants'
import routers from '@/routers'
import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { AtButton, AtCheckbox, AtIcon } from 'taro-ui'
import './index.less'

const AddressItem = ({
  addressInfo,
  delAddressSuccess,
  isDefaultUpdateSuccess,
  onSelectAddress,
}: {
  addressInfo: Address
  delAddressSuccess: Function
  isDefaultUpdateSuccess: Function
  onSelectAddress: (address: Address) => void
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
    // const findCheckoutIndex = getCurrentPages().findIndex((el) => {
    //   console.log(el.route)
    //   return el.route === routers.checkout.replace('/', '')
    // })
    // if (findCheckoutIndex > -1) {
    //   Taro.getStorage({
    //     key: 'address-from-checkout',
    //     success: function (data) {
    //       console.info('datadatadata', data)
    //       if (data.data) {
    //         Taro.setStorage({
    //           key: 'select-address',
    //           data: JSON.stringify(addressInfo),
    //           success: function (res) {
    //             console.log(res)
    //             Taro.navigateBack()
    //           },
    //         })
    //         Taro.removeStorageSync('address-from-checkout')
    //       }
    //     },
    //   })
    // }
    onSelectAddress(addressInfo)
  }

  return (
    <View className="p-1 bg-white mt-1 rounded AddressItem">
      <View onClick={selectAddress}>
        <View className="flex flex-row justify-between">
          <Text className="text-black font-semibold">{receiverName}</Text>
          <Text className="text-gray-400">{phone}</Text>
        </View>
        <View className="mt-2 pb-2 mb-0.5" style={{ borderBottom: '1px solid #E7E7E7' }}>
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
          <Image
            style={{ width: '0.45rem', height: '0.45rem' }}
            src="https://dtcdata.oss-cn-shanghai.aliyuncs.com/asset/image/icon_edit.png"
            onClick={editAddress}
          />
          <Image
            className="ml-1"
            style={{ width: '0.45rem', height: '0.45rem' }}
            src="https://dtcdata.oss-cn-shanghai.aliyuncs.com/asset/image/icon_delete.png"
            onClick={() => {
              setShowDelTip(true)
            }}
          />
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
            <View className="text-[29px] text-[#333] mt-2">您确定要删除这个地址嘛？</View>
            <View className="flex items-center justify-between my-2">
              <AtButton
                circle
                className="w-[190px] h-[60px] leading-[60px] text-[24px] text-white m-0 border-0 bg-[#96CC39]"
                onClick={delAddress}
              >
                确定
              </AtButton>
              <AtButton
                circle
                className="w-[190px] h-[60px] leading-[60px] text-[24px] text-white m-0 border-0 bg-[#C8E399] ml-2"
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
            <AtIcon value="close-circle" size={30} color="#fff" />
          </View>
        </View>
      </View>
    </View>
  )
}
export default AddressItem
