// import Announcement from '@/components/common/Announcement'
import { loginWithAlipay } from '@/components/consumer/AuthLogin/alipay-login'
import RotationChartList from '@/components/RotationChartList'
import { wxLogin } from '@/framework/api/consumer/consumer'
import { getPets } from '@/framework/api/pet/get-pets'
import { PetListItemProps } from '@/framework/types/consumer'
import { CDNIMGURL } from '@/lib/constants'
import { consumerAtom } from '@/store/consumer'
import { getAge } from '@/utils/utils'
import { Button, Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { AtAvatar, AtList, AtListItem } from 'taro-ui'
import './index.less'

const orderTypeList = [
  { label: '待付款', icon: CDNIMGURL + 'my-topay.png', url: '/pages/elencoOrdini/index?status=UNPAID' },
  { label: '待发货', icon: CDNIMGURL + 'my-toship.png', url: '/pages/elencoOrdini/index?status=TO_SHIP' },
  { label: '待收货', icon: CDNIMGURL + 'my-toconfirm.png', url: '/pages/elencoOrdini/index?status=SHIPPED' },
]

const Account = () => {
  const [consumer, setConsumer] = useAtom(consumerAtom)
  const [petList, setPetList] = useState<PetListItemProps[]>([])

  const getList = async (consumerId: string) => {
    let res = (await getPets({ consumerId })) || []
    res.forEach((item) => {
      item.age = getAge(item.birthday)
    })
    if (res.length) {
      setPetList(res)
    }
  }

  const loginInit = async () => {
    if (my.getStorageSync({ key: 'wxLoginRes' })) {
      // Taro.setStorageSync('commerce-loading', 1)
      const data = await wxLogin()
      setConsumer(data)
      getList(data.id)
      // setRefreshed(true)//兼容token过期报错
    }
  }

  useEffect(() => {
    // const res: any = my.getStorageSync({ key: 'wxLoginRes' })
    // if (!res.error && res.success && res.data?.userInfo?.id) {
    //   setConsumer(res.data.userInfo)
    // }
    loginInit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = () => {
    loginWithAlipay((data) => {
      setConsumer(data)
      getList(data.id)
    })
  }

  return (
    <View className="Account pb-2">
      <View className="flex items-center loginHerder">
        <AtAvatar size="large" className="mx-1.5" circle image={consumer?.avatarUrl || CDNIMGURL + 'my-notlo.png'} />
        {consumer?.id ? (
          <View className="flex flex-col">
            <Text className="UserName">{consumer?.nickName}</Text>
            <Text className="UserNameIcon flex items-center">
              <Image
                style={{
                  width: '15px',
                  height: '15px',
                  marginRight: '3px',
                }}
                className="rounded-full"
                src={`${CDNIMGURL}consumer_type.png`}
              />
              {consumer?.level}
            </Text>
          </View>
        ) : (
          <Button
            style={{ backgroundColor: 'transparent', border: 'none' }}
            type="default"
            openType="getAuthorize"
            scope="phoneNumber"
            onGetAuthorize={handleLogin}
          >
            点击授权登录
          </Button>
        )}
      </View>
      {/* 订单列表 */}
      <View className="p-1 h-full">
        <View>
          <AtList hasBorder={false} className="orderAtList">
            <AtListItem
              title="我的订单"
              hasBorder={false}
              arrow="right"
              extraText="查看全部订单"
              onClick={() =>
                Taro.navigateTo({
                  url: '/pages/elencoOrdini/index?status=ALL',
                })
              }
            />
            <View className="grid grid-cols-3 myOrderLists my-1">
              {orderTypeList.map((str, key) => (
                <View
                  key={key}
                  className="inline-block py-1 flex flex-col items-center justify-center"
                  onClick={() =>
                    Taro.navigateTo({
                      url: str.url,
                    })
                  }
                >
                  <Image
                    style={{
                      width: '30px',
                      height: '30px',
                    }}
                    className="mb-0.5"
                    src={str.icon}
                  />
                  <Text>{str.label}</Text>
                </View>
              ))}
            </View>
          </AtList>
        </View>
        {/* 宠物列表 */}
        <View className="my-1">
          <RotationChartList list={petList} />
        </View>
        {/* 计划列表 */}
        {/* <RotationChartList list={[1]} type="plan" /> */}
        {/* 其他选项 */}
        <AtList hasBorder={false} className="mt-1">
          <AtListItem
            thumb={`${CDNIMGURL}my-address.png`}
            hasBorder={false}
            title="收货地址"
            arrow="right"
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/addressManage/index`,
              })
            }}
          />
        </AtList>
        {/* <AtList hasBorder={false}>
          <AtListItem iconInfo={{ size: 28, value: 'user' }} title="个人信息" arrow="right" />
          <AtListItem iconInfo={{ size: 28, value: 'settings' }} title="设置" arrow="right" />
        </AtList> */}
      </View>
    </View>
  )
}

export default Account
