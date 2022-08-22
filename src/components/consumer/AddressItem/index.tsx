import { updateAddress } from '@/framework/api/consumer/address'
import { Address } from '@/framework/types/consumer'
import routers from '@/routers'
import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtCheckbox } from 'taro-ui'
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
              setAddressId(addressInfo?.id)
            }}
          />
        </View>
      </View>
    </View>
  )
}
export default AddressItem
