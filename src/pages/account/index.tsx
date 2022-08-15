// import Announcement from '@/components/common/Announcement'
import { loginWithAlipay } from '@/components/consumer/AuthLogin/alipay-login'
import RotationChartList from '@/components/RotationChartList'
import { wxLogin } from '@/framework/api/consumer/consumer'
import { CDNIMGURL } from '@/lib/constants'
import { consumerAtom } from '@/store/consumer'
import { Button, Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { AtAvatar, AtList, AtListItem } from 'taro-ui'
import './index.less'

const orderTypeList = [
  { label: '待付款', icon: CDNIMGURL + 'icon_MP_Unpaid.svg', url: '/pages/elencoOrdini/index?status=1' },
  { label: '待发货', icon: CDNIMGURL + 'icon_MP_To ship.svg', url: '/pages/elencoOrdini/index?status=2' },
  { label: '待收货', icon: CDNIMGURL + 'icon_MP_Shipped.svg', url: '/pages/elencoOrdini/index?status=3' },
]

const Account = () => {
  const [consumer, setConsumer] = useAtom(consumerAtom)

  const loginInit = async () => {
    if (my.getStorageSync({ key: 'wxLoginRes'})) {
      // Taro.setStorageSync('commerce-loading', 1)
      const data = await wxLogin()
      setConsumer(data)
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
    })
  }

  return (
    <View className="Account pb-2">
      <View className="flex items-center loginHerder">
        <AtAvatar className="mx-1.5" circle image={consumer?.avatarUrl || 'https://jdc.jd.com/img/200'} />
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
          <AtList className="orderAtList">
            <AtListItem
              title="我的订单"
              arrow="right"
              extraText="查看全部订单"
              onClick={() =>
                Taro.navigateTo({
                  url: '/pages/elencoOrdini/index?status=0',
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
        <RotationChartList list={[1, 2]} />
        {/* 计划列表 */}
        {/* <RotationChartList list={[1]} type="plan" /> */}
        {/* 其他选项 */}
        <AtList className="mt-1">
          <AtListItem
            thumb={`${CDNIMGURL}my-address.png`}
            title="收货地址"
            arrow="right"
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/addressManage/index`,
              })
            }}
          />
        </AtList>
        {/* <AtList>
          <AtListItem iconInfo={{ size: 28, value: 'user' }} title="个人信息" arrow="right" />
          <AtListItem iconInfo={{ size: 28, value: 'settings' }} title="设置" arrow="right" />
        </AtList> */}
      </View>
    </View>
  )
}

export default Account
