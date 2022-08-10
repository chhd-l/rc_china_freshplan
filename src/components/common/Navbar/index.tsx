import Taro, { getCurrentPages } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import IconFont from '@/iconfont'
import CustomerService from '@/components/common/CustomerService'
import { getStoreSettings } from '@/framework/api/storeSetting'

interface NavbarProps {
  children?: any //自定义navbar
  isAutoHeight?: boolean
  isCustom?: boolean //是否自定义，为true的话children必传
  isNeedBack?: boolean //是否需要返回组件 tab bar页面不需要，其余的基本都需要
  navbarTitle?: string //title
  backEvent?: Function //自定义返回上一页事件
  showService?: boolean //页面是否需要显示客服组件
}

const NavBar = ({
  children,
  isCustom = false,
  isNeedBack = false,
  navbarTitle = '',
  backEvent,
  isAutoHeight = false,
  showService = true,
}: NavbarProps) => {
  const [paddingTop, setPaddingTop] = useState<any>(0)
  const [MiniProShowService, setMiniProShowService] = useState(false) //全局是否需要显示客服组件

  const getStoreSettingList = async () => {
    console.log('store-settingaaaaaaa')
    // const storeSettings = await getStoreSettings()
    // setMiniProShowService(storeSettings?.find((item) => item.code === 'store_客服开关')?.isEnabled || false)
  }

  useEffect(() => {
    Taro.onAppShow(() => {
      console.log('aaaaaaaaa', 'onAppShow')
      // Taro.clearStorageSync()
    })
    //将状态栏高度挂载全局，方便自定义页面导航栏
    Taro.getSystemInfo({}).then((res) => {
      console.log(res.statusBarHeight)
      setPaddingTop(res.statusBarHeight)
    })
    getStoreSettingList()
  }, [])

  return (
    <View
      style={{
        paddingTop: paddingTop + 'px',
        height: isAutoHeight ? 'auto' : '85rpx',
        paddingBottom: '8rpx',
        zIndex: '99',
        width: '100%',
      }}
    >
      <View
        className="fixed top-0 left-0 bg-white"
        style={{
          paddingTop: paddingTop + 'px',
          height: isAutoHeight ? 'auto' : '85rpx',
          paddingBottom: '8rpx',
          zIndex: '99',
          width: '100%',
        }}
      >
        {isCustom ? (
          children
        ) : (
          <View className="flex items-center h-full pl-2">
            {isNeedBack ? (
              <View
                className="absolute flex items-center rounded-2xl"
                style={{ height: '30px', border: '1px solid #C3C3C3' }}
              >
                <View
                  style={{ borderRight: '1px solid #C3C3C3' }}
                  className="h-full flex items-center pl-3 pr-2"
                  onClick={() => {
                    console.log('navbar back click')
                    console.log('current pages router ', getCurrentPages())
                    if (backEvent) {
                      backEvent && backEvent()
                    } else {
                      Taro.navigateBack({ delta: 1 })
                    }
                  }}
                >
                  <IconFont name="fanhui-dingbu" size={40} />
                </View>
                <View
                  onClick={() => {
                    console.log('navbar back home click')
                    Taro.switchTab({
                      url: '/pages/index/index',
                    })
                  }}
                  className="h-full flex items-center pl-3 pr-3"
                >
                  <IconFont name="shouye" size={40} />
                </View>
              </View>
            ) : null}
            <View className="m-auto">{navbarTitle}</View>
          </View>
        )}
      </View>
      {showService && MiniProShowService ? <CustomerService /> : null}
    </View>
  )
}
export default NavBar
