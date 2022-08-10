import { useState } from 'react'
import { wxBindPhone, wxRegisterAndLogin } from '@/framework/api/consumer/consumer'
import { View, Text, Button } from '@tarojs/components'
import { useAtom, atom } from 'jotai'
import { consumerAtom } from '@/store/consumer'
import { AtButton, AtCheckbox, AtFloatLayout, AtToast } from 'taro-ui'
import BottonSwi from './BottonSwi'
import './index.less'
import Taro from '@tarojs/taro'

export const authLoginOpenedAtom = atom(false)

const chexOptions = [
  {
    value: 'chexOne',
    label:
      '本人已年满16周岁，同意并接受公司按《隐私政策》及《法律声明》的规定收集和处理我的个人信息。您可以就隐私问题通过隐私政策中的方式联系我们并行使您的个人信息权利。',
  },
  {
    value: 'chexTwo',
    label: '我已阅读和了解皇家爱宠有卡的《会员规则》并同意接受其中所有的条款。',
  },
]

enum Tab {
  Login,
  BindPhone,
}

const Tabs = [
  {
    label: '1.微信授权登录',
    value: Tab.Login,
  },
  {
    label: '2.绑定手机号',
    value: Tab.BindPhone,
  },
]

const AuthLogin = () => {
  const [tabValue, setTabValue] = useState<Tab>(Tab.Login)
  const [, setConsumer] = useAtom(consumerAtom)
  const [chexList, setChexList] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loginButton, setLoginButton] = useState<boolean>(false)
  const [authLoginOpened, setAuthLoginOpened] = useAtom(authLoginOpenedAtom)
  const login = async () => {
    if (isOpen) {
      const data = await wxRegisterAndLogin().then((res) => {
        setLoginButton(false)
        return res
      })
      setConsumer(data)
      setTabValue(Tab.BindPhone)
    } else {
      setLoginButton(true)
    }
  }

  const chexChange = (e) => {
    if (e.length === 2) {
      setChexList(e)
      setIsOpen(true)
    } else {
      setChexList(e)
      setIsOpen(false)
    }
  }
  const MainSwitch = () => {
    if (isOpen) {
      setIsOpen(false)
      setChexList([])
    } else {
      setIsOpen(true)
      setChexList(['chexOne', 'chexTwo'])
    }
  }

  const getTel = (e) => {
    Taro.checkSession({
      success: function () {
        wxBindPhone(e.detail.code)
        setAuthLoginOpened(false)
      },
      fail: function () {},
    })
  }

  if (Taro.getEnv() === Taro.ENV_TYPE.ALIPAY) {
    return null;
  }

  return (
    <View className="auth-login">
      <AtFloatLayout
        isOpened={authLoginOpened}
        onClose={() => {
          setAuthLoginOpened(false)
        }}
      >
        <View className="bottom-0 w-full bg-white overflow-hidden h-full">
          <View className="flex h-10">
            {Tabs.map((el) => (
              <View
                className={`flex-1 flex justify-center items-center text-center h-full text-xs ${
                  el.value === tabValue ? 'border-0  text-red-600' : ''
                }`}
                onClick={() => {
                  setTabValue(el.value)
                }}
              >
                <Text>{el.label}</Text>
              </View>
            ))}
          </View>
          {tabValue === Tab.Login ? (
            <View className="px-5">
              <AtCheckbox className="chexOne" options={chexOptions} selectedList={chexList} onChange={chexChange} />
              <View className="w-full h-10 flex items-center" onClick={MainSwitch}>
                <BottonSwi isOpen={isOpen} />
                一键勾选
              </View>
              <Button className="my-2 bg-red-600 text-white w-40 rounded-3xl" onClick={login}>
                授权登录
              </Button>
            </View>
          ) : (
            <View className="px-5 flex justify-center items-center">
              <View className="mt-20">
                <AtButton
                  className="h-10 leading-10"
                  type="primary"
                  openType="getPhoneNumber"
                  onGetPhoneNumber={(e) => getTel(e)}
                >
                  绑定手机号
                </AtButton>
                <AtButton className="border-0 text-gray" onClick={() => setAuthLoginOpened(false)}>
                  暂不绑定
                </AtButton>
              </View>
            </View>
          )}
        </View>
        <AtToast
          text="请先勾选条款"
          icon="check"
          isOpened={loginButton}
          duration={1200}
          onClose={() => setLoginButton(false)}
        />
      </AtFloatLayout>
    </View>
  )
}

export default AuthLogin
