import NoPlan from '@/components/NoPlan'
import Planned from '@/components/Planned'
import { getSubscriptionFindByConsumerId } from '@/framework/api/subscription/subscription'
import { getAgeYear } from '@/utils/utils'
import Taro from '@tarojs/taro'
import { useState } from 'react'

const Index = () => {
  const [SubscriptionList, setSubscriptionList] = useState([])
  const [consumer, setConsumer] = useState<any>(null)

  const getSubscriptionList = async () => {
    const res = await getSubscriptionFindByConsumerId()
    res.forEach((item) => {
      item.pet.age = getAgeYear(item.pet.birthday)
    })
    setSubscriptionList(res)
  }

  Taro.useDidShow(() => {
    let wxLoginRes = Taro.getStorageSync('wxLoginRes')
    getSubscriptionList()
    setConsumer(wxLoginRes)
  })

  return consumer?.userInfo?.id && SubscriptionList.length ? (
    <Planned subscriptionList={SubscriptionList} />
  ) : (
    <NoPlan />
  )
}

export default Index
