import '@/utils/global.ts'
import { useEffect } from 'react'

import '@/assets/css/custom-theme.scss'
import Taro from "@tarojs/taro"
import 'windi.css'
import './app.less'
import './assets/css/global.less'

const App = (props) => {
  useEffect(() => {
    console.log(props, '12345')
    Taro.onAppShow(() => {
      console.log('aaaaaaaaa', 'onAppShow')
      // Taro.clearStorageSync()
      // my.onError((message, stack) => {
      //   my.showToast({
      //     type: "fail",
      //     content: message,
      //     duration: 10000,
      //   })
      // })
    })
    // my.onError((error) => {
    //   my.showToast({
    //     type: "fail",
    //     content: error,
    //     duration: 10000,
    //   })
    // });
    // my.onComponentError((error) => {
    //   my.showToast({
    //     type: "fail",
    //     content: error.message,
    //     duration: 10000,
    //   });
    // });
    // my.onUnhandledRejection((res) => {
    //   my.showToast({
    //     type: "fail",
    //     content: (res?.reason || res?.reason?.message || 'Promise error'),
    //     duration: 10000,
    //   })
    // });
  }, [])

  return props.children
}

export default App
