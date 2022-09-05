import { updateAddress } from '@/framework/api/consumer/address'
import { Address } from '@/framework/types/consumer'
import routers from '@/routers'
import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.less'

const AddressItem = ({
  addressInfo,
  isDefaultUpdateSuccess,
  onSelectAddress,
  setShowDelTip,
  setAddressId,
}: {
  addressInfo: Address
  setShowDelTip: any
  isDefaultUpdateSuccess: Function
  onSelectAddress: (address: Address) => void
  setAddressId: Function
}) => {
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
    <View className="px-1 pt-1 pb-0.5 bg-white mb-1 rounded AddressItem">
      <View onClick={selectAddress}>
        <View className="flex flex-row justify-between">
          <Text className="text-black font-semibold text-[34px]">{receiverName}</Text>
          <Text className="text-[#A5A5A5]">{phone}</Text>
        </View>
        <View className="mt-2 pb-2 mb-0.5" style={{ borderBottom: '1px solid #eee' }}>
          <Text className="">
            {province} {city} {region} {detail}
          </Text>
        </View>
      </View>
      <View className="flex flex-row justify-between items-center py-[10px]">
        <View
          className="flex items-center text-[#A5A5A5] text-[26px]"
          onClick={(e) => {
            e.stopPropagation()
            setAsDefault()
          }}
        >
          <Text
            style={{
              color: addressInfo.isDefault ? '#96CC39' : '#C7C7C7',
              fontSize: addressInfo.isDefault ? '0.32rem' : '0.31rem',
            }}
            className={`rcciconfont ${addressInfo.isDefault ? 'rccicon-xuanzhong' : 'rccicon-tuoyuanxing'} mr-[17px]`}
          />
          <Text className="block pb-[3px]">默认地址</Text>
        </View>
        <View className="flex flex-row items-center">
          <View
            className="w-[50px] h-[50px] bg-[#F3F3F3] rounded-full flex items-center justify-center"
            onClick={editAddress}
          >
            <Text
              className="rcciconfont rccicon-iedit"
              style={{
                fontSize: '14px',
              }}
            ></Text>
          </View>
          <View
            className="w-[50px] h-[50px] bg-[#F3F3F3] rounded-full flex items-center justify-center ml-1"
            onClick={() => {
              setShowDelTip(true)
              setAddressId(addressInfo?.id)
            }}
          >
            <Text
              className="rcciconfont rccicon-idelete"
              style={{
                fontSize: '14px',
              }}
            ></Text>
          </View>
        </View>
      </View>
    </View>
  )
}
export default AddressItem
