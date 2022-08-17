import { SERVICEPATH } from '@/lib/constants'
import ClientBuilder from '@/rc-china-commerce/packages/taro/lib'
import Taro from '@tarojs/taro'

const consumerInfo = Taro.getStorageSync('wxLoginRes').userInfo

export const isMock = false

export const baseSetting = {
  consumerId: consumerInfo?.id || 'test001',
  storeId: '12345678',
}

// const API_URL = 'http://localhost:9000/graphql'
// 生产
// const API_URL = 'https://msdev.d2cgo.com/faas/graphql'
const API_URL = `${SERVICEPATH}/graphql`
// const API_URL = 'http://20.62.176.70/faas/graphql'

// const API_URL = 'https://dtc-faas-dtc-plaform-dev-woyuxzgfcv.cn-shanghai.fcapp.run/graphql'
// 开发
// const API_URL = 'https://dtc-faas-dev-dtc-plaform-dev-yfetifgpvj.cn-shanghai.fcapp.run/graphql'

const ApiRoot = ({ url = API_URL }: { url?: string } = { url: API_URL }) => new ClientBuilder().config({ url: url })
// new ClientBuilder().config({ url: API_URL })
export default ApiRoot
