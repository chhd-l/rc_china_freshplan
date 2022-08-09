// import Announcement from '@/components/common/Announcement'
import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtAvatar, AtList, AtListItem } from 'taro-ui'
import './index.less'

const Account = () => {
  return (
    <View className="Account">
      <View className="flex items-center loginHerder">
        <AtAvatar className="mx-1.5" circle image="https://jdc.jd.com/img/200" />
        <Text>点击授权登录</Text>
      </View>
      <View
        className="p-1"
        style={{
          backgroundColor: '#E4E4E4',
        }}
      >
        <AtList className="mb-1">
          <AtListItem
            iconInfo={{ size: 28, value: 'map-pin' }}
            title="收货地址"
            arrow="right"
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/addressList/index`,
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
