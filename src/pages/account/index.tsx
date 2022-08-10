// import Announcement from '@/components/common/Announcement'
import { Image, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { AtAvatar, AtIcon, AtList, AtListItem } from 'taro-ui'
import { loginWithAlipay } from '@/components/consumer/AuthLogin/alipay-login';
import './index.less'

const Account = () => {
  const [current, setCurrent] = useState(1)

  const handleLogin = () => {
    loginWithAlipay();
  }

  return (
    <View
      className="Account pb-3"
      style={{
        backgroundColor: '#E4E4E4',
      }}
    >
      <View className="flex items-center loginHerder">
        <AtAvatar className="mx-1.5" circle image="https://jdc.jd.com/img/200" />
        <Text onClick={handleLogin}>点击授权登录</Text>
      </View>
      {/* 订单列表 */}
      <View className="p-1 h-full">
        <View>
          <AtList className="orderAtList">
            <AtListItem title="我的订单" arrow="right" extraText="查看全部订单" />
            <View className="grid grid-cols-3 myOrderLists">
              <View className="inline-block py-1 flex flex-col items-center justify-center">
                <AtIcon className="my-0.5" value="clock" size="30" />
                <Text>待付款</Text>
              </View>
              <View className="inline-block py-1 flex flex-col items-center justify-center">
                <AtIcon className="my-0.5" value="clock" size="30" />
                <Text>待付款</Text>
              </View>
              <View className="inline-block py-1 flex flex-col items-center justify-center">
                <AtIcon className="my-0.5" value="clock" size="30" />
                <Text>待付款</Text>
              </View>
            </View>
          </AtList>
        </View>
        {/* 宠物列表 */}
        <View className="Pets bg-white my-1" style={{ borderRadius: '16px' }}>
          <View className="PetTitle flex items-center justify-between p-1">
            我的宠物
            <Image
              style={{ width: '20px', height: '20px' }}
              src="https://dtc-platform.oss-cn-shanghai.aliyuncs.com/static/pet_edit.png"
              onClick={() => my.navigateTo({ url: '/pages/packageB/petList/index' })}
            />
          </View>
          <View className="box-border px-2">
            <View className="box-border overflow-hidden">
              <View className="w-full flex flex-col items-center mt-1 mb-2 overflow-hidden">
                <Swiper
                  className="w-full flex items-center overflow-hidden"
                  circular
                  nextMargin="90px"
                  previousMargin="105px"
                  current={current}
                  onChange={(e) => {
                    const index = e.detail.current === 4 ? 0 : e.detail.current
                    setCurrent(index)
                  }}
                >
                  {[1, 2, 3, 4].map((_, key) => (
                    <SwiperItem key={key}>
                      <View
                        style={{
                          width: '100px',
                          height: '100px',
                        }}
                        className="flex items-center justify-center"
                      >
                        <Image
                          style={{
                            width: current === key ? '80%' : '60%',
                            height: current === key ? '80%' : '60%',
                          }}
                          className="rounded-full"
                          src="https://jdc.jd.com/img/200"
                        />
                      </View>
                    </SwiperItem>
                  ))}
                </Swiper>
                <View className="PetInfo mt-1">
                  <Text className="PetInfoOne mr-2">xxxx</Text>
                  <Text className="mr-0.5">xxx</Text>
                  <Text>xxx</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* 其他选项 */}
        <AtList className="my-1">
          <AtListItem
            iconInfo={{ size: 28, value: 'map-pin' }}
            title="收货地址"
            arrow="right"
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/addressManage/index`,
              })
            }}
          />
        </AtList>
        <AtList>
          <AtListItem iconInfo={{ size: 28, value: 'user' }} title="个人信息" arrow="right" />
          <AtListItem iconInfo={{ size: 28, value: 'settings' }} title="设置" arrow="right" />
        </AtList>
      </View>
    </View>
  )
}

export default Account
