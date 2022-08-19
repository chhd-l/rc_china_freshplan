import NoPlan from '@/components/NoPlan'
import Planned from '@/components/Planned'
import { getSubscriptionFindByConsumerId } from '@/framework/api/subscription/subscription'
import { getAgeYear } from '@/utils/utils'
import customerServiceImg from '@/assets/img/customerService.png'

import Taro from '@tarojs/taro'
import { useState } from 'react'
import { wxLogin } from '@/framework/api/consumer/consumer'
import { useAtom } from 'jotai'
import { consumerAtom } from '@/store/consumer'
import { Image } from '@tarojs/components'

const Index = () => {
  const [SubscriptionList, setSubscriptionList] = useState([])
  const [consumer, setConsumer] = useAtom(consumerAtom)

  const getSubscriptionList = async () => {
    const res = await getSubscriptionFindByConsumerId()
    console.log('res', res)
    res.forEach((item) => {
      item.pet.age = getAgeYear(item.pet.birthday)
    })
    setSubscriptionList(res)
  }

  const loginInit = async () => {
    let wxLoginRes = Taro.getStorageSync('wxLoginRes')
    if (wxLoginRes?.userInfo?.id) {
      const data = await wxLogin()
      setConsumer(data)
      getSubscriptionList()
    }
  }

  Taro.useDidShow(() => {
    loginInit()
  })

  return (
    <>
      <Image
        src={customerServiceImg}
        mode="widthFix"
        className="fixed top-[1140px] right-0 !w-[141px] z-50"
        onClick={() => {
          Taro.navigateTo({ url: '/pages/packageA/customerService/index' })
        }}
      />
      {consumer?.id && SubscriptionList.length ? <Planned subscriptionList={SubscriptionList} /> : <NoPlan />}
    </>
  )
}

export default Index
