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
import { Image, View } from '@tarojs/components'
import { getPets } from '@/framework/api/pet/get-pets'

const Index = () => {
  const [SubscriptionList, setSubscriptionList] = useState([])
  const [consumer, setConsumer] = useAtom(consumerAtom)

  const getSubscriptionList = async () => {
    const res = await getSubscriptionFindByConsumerId()
    const _storeRes: any = Taro.getStorageSync('wxLoginRes')
    const pet = (await getPets({ consumerId: _storeRes?.userInfo?.id })) || []
    if (pet.length) {
      res.forEach((item) => {
        pet.forEach((p: any) => {
          if (p.id === item.pet.id) {
            p.age = getAgeYear(p.birthday)
            item.pet = p
          }
        })
      })
    }
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
    my.setNavigationBar({
      backgroundColor: '#d3e4b5',
    })
  })

  return (
    <>
      <View
        className="w-[110px] fixed right-0  z-50 top-[1140px] "
        onClick={() => {
          Taro.navigateTo({ url: '/pages/packageA/customerService/index' })
        }}
      >
        <Image src={customerServiceImg} mode="widthFix" />
      </View>

      {consumer?.id && SubscriptionList.length ? <Planned subscriptionList={SubscriptionList} /> : <NoPlan />}
    </>
  )
}

export default Index
