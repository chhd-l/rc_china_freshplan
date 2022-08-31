// import Announcement from '@/components/common/Announcement'
import { loginWithAlipay } from '@/components/consumer/AuthLogin/alipay-login'
import RotationChartList from '@/components/RotationChartList'
import PetNavigation from '@/components/PetNavigation'
import { wxLogin } from '@/framework/api/consumer/consumer'
import { getPets } from '@/framework/api/pet/get-pets'
import { PetListItemProps, PetType } from '@/framework/types/consumer'
import { CDNIMGURL, CDNIMGURL2 } from '@/lib/constants'
import { consumerAtom } from '@/store/consumer'
import { getAge } from '@/utils/utils'
import { Button, Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { AtAvatar, AtList, AtListItem } from 'taro-ui'
import './index.less'

const orderTypeList = [
  { label: '待付款', icon: CDNIMGURL2 + 'my-waitpay.png', url: '/pages/packageA/elencoOrdini/index?status=UNPAID' },
  { label: '待发货', icon: CDNIMGURL2 + 'my-waitship.png', url: '/pages/packageA/elencoOrdini/index?status=TO_SHIP' },
  { label: '待收货', icon: CDNIMGURL2 + 'my-receive.png', url: '/pages/packageA/elencoOrdini/index?status=SHIPPED' },
]

const Account = () => {
  const [consumer, setConsumer] = useAtom(consumerAtom)
  const [petList, setPetList] = useState<PetListItemProps[]>([])
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const [hasDog, setHasDog] = useState<boolean>(false)
  const [hasCat, setHasCat] = useState<boolean>(false)

  const getAuthentication = async (callback?: Function) => {
    if (!isLogin) {
      // loginWithAlipay(callback);
      Taro.showToast({ title: '请先授权登录' })
    } else {
      callback && callback()
    }
  }

  const getList = async (consumerId: string) => {
    let cat = false, dog = false;
    let res = await getPets({ consumerId });
    res.forEach((item) => {
      item.age = getAge(item.birthday);
      if (item.type === PetType.Cat) {
        cat = true;
      }
      if (item.type === PetType.Dog) {
        dog = true;
      }
    })
    console.log('account get list:', res);
    setPetList(res ?? []);
    setHasCat(cat);
    setHasDog(dog);
  }

  const loginInit = async () => {
    const _storeRes: any = Taro.getStorageSync('wxLoginRes')
    if (_storeRes?.userInfo?.id) {
      // Taro.setStorageSync('commerce-loading', 1)
      const data = await wxLogin()
      setConsumer(data)
      getList(data.id)
      setIsLogin(true)
    } else {
      setIsLogin(false)
    }
  }

  Taro.useReady(() => {
    my.setNavigationBar({ backgroundColor: '#C3EC7B', frontColor: '#000000' })
  })

  Taro.useDidShow(() => {
    loginInit()
  })

  const handleLogin = () => {
    loginWithAlipay((data) => {
      setConsumer(data)
      getList(data.id)
      setIsLogin(true)
    })
  }

  const petDetail = (pet: PetListItemProps) => {
    Taro.navigateTo({
      url: '/pages/packageA/petDetail/index',
      success: (res) => {
        res.eventChannel.emit('petFromList', pet);
      }
    });
  }

  return (
    <View className="Account pb-2">
      <View className="flex items-center loginHerder">
        <AtAvatar size="large" className="mx-1.5" circle image={consumer?.avatarUrl || CDNIMGURL + 'my-notlo.png'} />
        {consumer?.id ? (
          <View className="flex flex-col">
            <Text className="UserName">{consumer?.nickName}</Text>
            <Text className="UserNameIcon flex items-center">
              {hasCat && hasDog ? '猫狗双全天下赢家' : hasCat ? '什么都不干只想撸猫' : hasDog ? '天天遛狗锻炼身体' : '暂无可服侍的小主'}
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
        <View className="rccBoxShadow">
          <AtList hasBorder={false} className="orderAtList">
            <View 
              className="p-1 flex items-center"
              onClick={() =>
                getAuthentication(() => {
                  Taro.navigateTo({
                    url: '/pages/packageA/elencoOrdini/index?status=ALL',
                  })
                })
              }
            >
              <View className="w-[50px] h-[50px]">
                <Image src={`${CDNIMGURL2}orderlist-icon.png`} mode="widthFix" />
              </View>
              <View className="flex-1 ml-0.5 text-28 font-bold">我的订单</View>
              <View className="mr-0.5 text-26 text-gray-400">查看全部订单</View>
              <View className="rcciconfont rccicon-right text-28 text-gray-400" />
            </View>
            <View className="grid grid-cols-3 myOrderLists mb-1">
              {orderTypeList.map((str, key) => (
                <View
                  key={key}
                  className="inline-block py-1 flex flex-col items-center justify-center"
                  onClick={() =>
                    getAuthentication(() => {
                      Taro.navigateTo({
                        url: str.url,
                      })
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
        <AtList hasBorder={false} className="my-1 bg-white orderAtList rccBoxShadow">
          <View 
            className="p-1 flex items-center"
            onClick={() => {
              getAuthentication(() => {
                Taro.navigateTo({ url: '/pages/packageA/petList/index' })
              })
            }}
          >
            <View className="w-[50px] h-[50px]">
              <Image src={`${CDNIMGURL2}pet-foot.png`} mode="widthFix" />
            </View>
            <View className="flex-1 ml-0.5 text-28 font-bold">我的宠物</View>
            <View className="mr-0.5 text-26 text-gray-400">宠物管理</View>
            <View className="rcciconfont rccicon-right text-28 text-gray-400" />
          </View>
          <View className="p-1">
            <PetNavigation
              petList={petList}
              hasAdd={true}
              hasSelect={false}
              onAdd={() => {
                getAuthentication(() => {
                  Taro.navigateTo({ url: '/pages/packageA/petEdit/index' })
                })
              }}
              onSelect={petDetail}
            />
          </View>
        </AtList>
        {/* <View className="my-1">
          <RotationChartList
            list={petList}
            onClickPetList={() => {
              getAuthentication(() => {
                Taro.navigateTo({ url: '/pages/packageA/petList/index' })
              })
            }}
            onClickPetAdd={() => {
              getAuthentication(() => {
                Taro.navigateTo({ url: '/pages/packageA/petEdit/index' })
              })
            }}
          />
        </View> */}
        {/* 其他选项 */}
        <AtList hasBorder={false} className="mt-1 rccBoxShadow">
          <View 
            className="p-1 flex items-center"
            onClick={() => {
              getAuthentication(() => {
                Taro.navigateTo({
                  url: `/pages/packageA/addressManage/index`,
                })
              })
            }}
          >
            <View className="w-[50px] h-[50px]">
              <Image src={`${CDNIMGURL2}location-icon.png`} mode="widthFix" />
            </View>
            <View className="flex-1 ml-0.5 text-28 font-bold">收货地址</View>
            <View className="rcciconfont rccicon-right text-28 text-gray-400" />
          </View>
        </AtList>
        <AtList hasBorder={false} className="mt-1 rccBoxShadow">
          <View 
            className="p-1 flex items-center"
            onClick={() => {
              getAuthentication(() => {
                Taro.navigateTo({
                  url: '/pages/packageA/invoiceManage/index',
                })
              })
            }}
          >
            <View className="w-[50px] h-[50px]">
              <Image src={`${CDNIMGURL2}invoice-icon.png`} mode="widthFix" />
            </View>
            <View className="flex-1 ml-0.5 text-28 font-bold">发票管理</View>
            <View className="rcciconfont rccicon-right text-28 text-gray-400" />
          </View>
        </AtList>
      </View>
    </View>
  )
}

export default Account
