import RegionPicker from '@/components/WePicker/index'
import { createAddress, updateAddress } from '@/framework/api/consumer/address'
import { Address } from '@/framework/types/consumer'
import { pickForUpdate } from '@/utils/utils'
import { Text, View } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { AtButton, AtForm, AtInput, AtTextarea, AtToast } from 'taro-ui'
import './index.less'

const NewAddress = () => {
  const { router } = getCurrentInstance()
  const [addressInfo, setAddressInfo] = useState<Address>({
    receiverName: '',
    phone: '',
    province: '',
    city: '',
    region: '',
    detail: '',
    isDefault: false,
  })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isOpenPhone, setIsOpenPhone] = useState<boolean>(false)

  const [address, setAddress] = useState(['浙江省', '杭州市', '滨江区'])
  const { province, city, region } = addressInfo
  const [initData, setInitData] = useState(null)

  const [WPickerRef, setWPickerRef] = useState({
    show: () => {},
  })

  const onRef = (ref) => {
    setWPickerRef(ref)
  }

  const onConfirm = (res: any) => {
    const { obj } = res
    setAddressInfo({
      ...addressInfo,
      province: obj.province.label,
      city: obj.city.label,
      region: obj.area.label,
    })
    setAddress([obj.province.label, obj.city.label, obj.area.label])
  }
  const onCancel = () => {}

  const updateAddressInfo = (value: any, name: string) => {
    setAddressInfo({ ...addressInfo, [name]: value })
  }

  const saveNewAddress = async () => {
    let actionRes = false
    if (!addressInfo.detail || !addressInfo.phone || !addressInfo.province || !addressInfo.receiverName) {
      setIsOpen(true)
      return
    } else if (!/^1[3456789]\d{9}$/.test(addressInfo.phone)) {
      setIsOpenPhone(true)
      return
    } else if (router?.params.type === 'edit') {
      let params = pickForUpdate(addressInfo, initData)
      actionRes = await updateAddress({
        params: Object.assign(params, { id: addressInfo.id }),
      })
    } else {
      actionRes = await createAddress(addressInfo)
    }
    if (actionRes) {
      Taro.navigateBack({
        delta: 1,
      })
    }
  }

  useEffect(() => {
    if (router?.params.type === 'edit') {
      //编辑
      Taro.getStorage({
        key: 'current-address',
        success: function (response) {
          if (response?.data) {
            const data = JSON.parse(response.data)
            setAddressInfo(data)
            setInitData(data)
            setAddress([data.province, data.city, data.region])
          }
        },
      })
    }
  }, [router?.params.type])

  Taro.useDidShow(() => {
    if (router?.params.type === 'edit') {
      my.setNavigationBar({
        title: '修改地址',
      })
    } else {
      my.setNavigationBar({
        title: '新增地址',
      })
    }
  })

  return (
    <View className="NewAddress bg-gray-eee p-1 h-screen ">
      <AtForm className="p-1 rounded" onSubmit={() => saveNewAddress()}>
        <View className="bg-white">
          <AtInput
            name="receiverName"
            title="收货人"
            type="text"
            placeholder="请输入姓名"
            value={addressInfo['receiverName']}
            onChange={(value) => updateAddressInfo(value, 'receiverName')}
            className="rc-address-input ml-0 receiverName"
          />
          <AtInput
            name="phone"
            title="联系电话"
            type="text"
            placeholder="请输入联系电话"
            value={addressInfo['phone']}
            onChange={(value) => updateAddressInfo(value, 'phone')}
            className="rc-address-input ml-0"
          />
          <View
            className="pt-1 pb-2 text-28 border-b border-t-0 border-l-0 border-r-0 border-solid flex items-center"
            style={{ borderColor: '#E7E7E7' }}
          >
            <Text>所在地区</Text>
            <Text
              onClick={() => {
                WPickerRef.show()
              }}
              className={`${province ? '' : 'text-gray-300'} pl-[0.39rem] flex-1`}
              style={{
                marginLeft: '0.44rem',
              }}
            >
              {province ? province + '，' + city + '，' + region : <Text className="pl-[0.1rem]">省，市，区</Text>}
            </Text>
          </View>
          <RegionPicker
            mode="region"
            value={address}
            defaultType="label"
            hideArea={false}
            confirm={(res) => onConfirm(res)}
            cancel={onCancel}
            onRef={onRef}
          />
          <View className="flex pt-1">
            <View className="mr-[0.83rem] text-[28px]">详细地址</View>
            <AtTextarea
              value={addressInfo['detail']}
              onChange={(value) => updateAddressInfo(value, 'detail')}
              maxLength={200}
              placeholder="请输入详细地址"
              count={false}
              className="border-0 border-t-0 rc-text-area py-0 pl-[0.02rem] pr-[0.18rem] flex-1"
            />
          </View>
        </View>
      </AtForm>
      <View
        className="text-gray-400 flex items-center justify-between p-1 bg-white rounded mt-1"
        onClick={() => {
          updateAddressInfo(!addressInfo.isDefault, 'isDefault')
        }}
      >
        <Text className="text-[30px] text-black">默认地址</Text>
        <View
          className={`rounded-full switch flex items-center ${
            addressInfo.isDefault ? 'justify-start' : 'justify-end'
          } p-[2px] w-[74px] h-[42px] ${addressInfo.isDefault ? 'bg-[#96CC39]' : 'bg-[#B7B7B7]'}`}
        >
          <View className="rounded-full h-[40px] w-[40px] bg-white" />
        </View>
      </View>
      <View className="w-full pt-1 pb-2 fixed bottom-0 left-0 bg-white">
        <AtButton
          className="mx-4 rounded-full tracking-[0.2em]"
          customStyle={{ backgroundColor: '#96CC39', borderColor: '#96CC39' }}
          type="primary"
          formType="submit"
          onClick={saveNewAddress}
        >
          保存
        </AtButton>
      </View>
      <AtToast
        isOpened={isOpen}
        duration={1200}
        text="请填写完整地址信息"
        icon="close"
        onClose={() => setIsOpen(false)}
      />
      <AtToast
        isOpened={isOpenPhone}
        duration={1200}
        text="请填写正确手机号码"
        icon="close"
        onClose={() => setIsOpenPhone(false)}
      />
    </View>
  )
}

export default NewAddress
