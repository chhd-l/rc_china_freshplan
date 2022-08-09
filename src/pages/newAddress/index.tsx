import { Radio, View, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { AtForm, AtInput, AtButton, AtTextarea, AtToast } from 'taro-ui'
import { Address } from '@/framework/types/consumer'
import RegionPicker from '@/components/common/WePicker/index'
import { createAddress, updateAddress } from '@/framework/api/consumer/address'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { pickForUpdate } from '@/utils/utils'
import './index.less'

const Index = () => {
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
    console.log('ref', ref)
    setWPickerRef(ref)
  }

  const onConfirm = (res: any) => {
    console.log(res)
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
          console.log(response)
          if (response?.data) {
            const data = JSON.parse(response.data)
            setAddressInfo(data)
            setInitData(data)
            setAddress([data.province, data.city, data.region])
          }
        },
      })
    }
  }, [])

  return (
    <>
      <View className="index bg-gray-eee p-1 h-screen">
        <AtForm className="p-1 rounded" onSubmit={() => saveNewAddress()}>
          <View className="bg-white">
            <AtInput
              name="receiverName"
              title="收货人"
              type="text"
              placeholder="请输入姓名"
              value={addressInfo['receiverName']}
              onChange={(value) => updateAddressInfo(value, 'receiverName')}
              className="rc-address-input"
            />
            <AtInput
              name="phone"
              title="联系电话"
              type="text"
              placeholder="请输入联系电话"
              value={addressInfo['phone']}
              onChange={(value) => updateAddressInfo(value, 'phone')}
              className="rc-address-input"
            />
            <View
              className="py-3 text-28 border-b border-t-0 border-l-0 border-r-0 border-solid"
              style={{ borderColor: '#d6e4ef', paddingLeft: '0.28rem' }}
            >
              <Text>所在地区</Text>
              <Text
                onClick={() => {
                  console.log('WPickerRef', WPickerRef)
                  WPickerRef.show()
                }}
                className={`${province ? '' : 'text-gray-300'} pl-2`}
                style={{
                  marginLeft: '0.44rem',
                }}
              >
                {province ? province + ',' + city + ',' + region : '省,市,区'}
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
            <AtTextarea
              value={addressInfo['detail']}
              onChange={(value) => updateAddressInfo(value, 'detail')}
              maxLength={200}
              placeholder="请输入详细地址"
              count={false}
              className="ml-1 border-0 border-t-0 rc-text-area"
            />
            <Radio
              value="0"
              checked={Boolean(addressInfo.isDefault)}
              onClick={() => updateAddressInfo(!addressInfo.isDefault, 'isDefault')}
              color="#d33024"
              className="mt-2 text-40 -ml-4 text-gray-400 transform-6"
            >
              &nbsp;默认地址
            </Radio>
          </View>
        </AtForm>
        <View className="mt-3 flex justify-center">
          <AtButton
            className="bg-primary-red border-primary-red text-white w-36 rounded-3xl text-28"
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
    </>
  )
}

export default Index
