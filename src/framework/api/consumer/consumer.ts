import { Consumer } from '@/framework/types/consumer'
import Taro from '@tarojs/taro'
import apis from '@/framework/config/api-config'
import ApiRoot from '../fetcher'

interface WxLoginResult {
  access_token: string
  userInfo: Consumer
}
export const wxRegisterAndLogin = async (): Promise<Consumer> => {
  const { userInfo } = await Taro.getUserProfile({
    lang: 'zh_CN',
    desc: '获取授权',
  })
  const loginRes = await Taro.login()
  console.log('loginRes', loginRes)
  debugger
  const { wxRegisterAndLogin: wxLoginRes }: { wxRegisterAndLogin: WxLoginResult } =
    await ApiRoot({ url: apis.auth }).consumers().wxRegisterAndLogin({
      input: {
        jsCode: loginRes.code,
        storeId: '12345678',
      },
      userInfo: {
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        gender: userInfo.gender + '',
      },
    }, userInfo.nickName)
  Taro.setStorageSync('wxLoginRes', wxLoginRes)
  return wxLoginRes.userInfo
}

export const aliRegisterAndLogin = async (auth_code: string): Promise<Consumer> => {
  const { wxRegisterAndLogin: wxLoginRes }: { wxRegisterAndLogin: WxLoginResult } =
    await ApiRoot({ url: apis.auth }).consumers().wxRegisterAndLogin({
      input: {
        jsCode: auth_code,
        storeId: '12345678',
      },
      userInfo: {
        avatarUrl: "",
        nickName: "",
        gender: "",
      },
    }, "")
  my.setStorageSync({ key: 'wxLoginRes', data: wxLoginRes })
  return wxLoginRes.userInfo
}

export const wxLogin = async () => {
  let wxLoginResStorage = Taro.getStorageSync('wxLoginRes')
  const { wxLogin: wxLoginRes }: { wxLogin: WxLoginResult } = await ApiRoot({ url: apis.auth }).consumers().wxLogin({
    token: wxLoginResStorage.access_token,
    // id: wxLoginResStorage.userInfo.id,
  })
  console.log('wxLoginRes', wxLoginRes)
  Taro.setStorageSync('wxLoginRes', Object.assign(wxLoginResStorage, wxLoginRes))
  return wxLoginRes.userInfo
}

export const wxBindPhone = async (jsCode) => {
  let wxLoginRes = Taro.getStorageSync('wxLoginRes')
  if (wxLoginRes) {
    const res = await ApiRoot({ url: apis.auth }).consumers().wxBindPhone({
      input: {
        jsCode,
        storeID: '12345678',
        consumerId: wxLoginRes.userInfo.id,
      },
    })
    if (res?.wxBindPhoneNumber) {
      Taro.showToast({ icon: 'success', title: '绑定成功' })
    }
  }
}
