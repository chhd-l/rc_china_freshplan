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
    })
  }, [])

  return props.children
}

export default App
