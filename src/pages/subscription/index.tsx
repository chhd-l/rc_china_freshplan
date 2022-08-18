import Planned from '@/components/Planned'
import NoPlan from '@/components/NoPlan'
import { getSubscriptionFindByConsumerId } from '@/framework/api/subscription/subscription'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'

const Index = () => {
  const [SubscriptionList, setSubscriptionList] = useState([])
  const [consumer, setConsumer] = useState<any>(null)

  const getSubscriptionList = async () => {
    const res = await getSubscriptionFindByConsumerId()
    console.log('res', res)
    setSubscriptionList(res)
  }

  useEffect(() => {
    let wxLoginRes = Taro.getStorageSync('wxLoginRes')
    console.log('wxLoginRes', wxLoginRes)
    getSubscriptionList()
    setConsumer(wxLoginRes)
  }, [])

  return consumer?.userInfo?.id && SubscriptionList.length ? <Planned /> : <NoPlan />
}

export default Index
