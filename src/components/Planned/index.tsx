import CommonProblem from '@/components/subscription/CommonProblem'
import FreshFoodExperience from '@/components/subscription/Freshfoodexperience'
import LovePetHealth from '@/components/subscription/LovePetHealth'
import Step from '@/components/subscription/Step'
import { PetPosture } from '@/framework/types/consumer'
import { CDNIMGURL, CDNIMGURL2 } from '@/lib/constants'
import { consumerAtom } from '@/store/consumer'
import {
  BaseEventOrig,
  Button,
  Image,
  ScrollView,
  ScrollViewProps,
  Swiper,
  SwiperItem,
  Text,
  View,
} from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAtom } from 'jotai'
import moment from 'moment'
import { useState } from 'react'
import { AtAvatar, AtButton, AtIcon } from 'taro-ui'
import { loginWithAlipay } from '../consumer/AuthLogin/alipay-login'
import './index.less'

const scrollTop = 0
const Threshold = 20

const TextView = ({ subscriptionList }: { subscriptionList: any[] }) => {
  const [consumer, setConsumer] = useAtom(consumerAtom)
  const [current, setCurrent] = useState(0)
  const [scrollHeight, setScrollHeight] = useState(0)
  const onScroll = (e: BaseEventOrig<ScrollViewProps.onScrollDetail>) => setScrollHeight(e.detail.scrollTop)

  const returnPetdefaultImage = (petType: string) => {
    if (petType === 'CAT') return 'cat-default.png'
    else return 'dog-default.png'
  }

  const handleLogin = (callback?: Function) => {
    if (consumer?.id) {
      callback && callback()
    } else {
      loginWithAlipay((data) => {
        setConsumer(data)
        callback && callback()
      })
    }
  }

  return (
    <View className="oldUserPlan bg-[#d3e4b5]">
      <View
        className={`${scrollHeight > 600 ? 'block' : 'hidden'} bg-transparent bottom-0 left-0 w-full z-10 py-1`}
        style={{
          position: 'fixed',
        }}
      >
        {consumer?.id ? (
          <Button
            className="mx-4 rounded-full flex items-center bg-color-primary justify-center border-0"
            type="primary"
            onClick={() => {
              Taro.navigateTo({ url: '/pages/packageA/choosePet/index' })
            }}
          >
            <AtIcon className="mr-1" value="clock" size="26" />
            开始定制
          </Button>
        ) : (
          <Button
            className="mx-4 rounded-full flex items-center bg-color-primary justify-center border-0"
            type="primary"
            openType="getAuthorize"
            scope="phoneNumber"
            onGetAuthorize={() => {
              handleLogin(() => {
                Taro.navigateTo({ url: '/pages/packageA/choosePet/index' })
              })
            }}
          >
            <AtIcon className="mr-1" value="clock" size="26" />
            开始定制
          </Button>
        )}
      </View>
      <ScrollView
        className="scrollview"
        scrollY
        scrollWithAnimation
        scrollTop={scrollTop}
        style={{ height: '100vh' }}
        lowerThreshold={Threshold}
        onScroll={onScroll}
      >
        <View className="px-3 py-2 title flex items-center">
          <Image className="mr-0.5" src={`${CDNIMGURL}claws.png`} />
          <Text className={`${subscriptionList[current]?.pet?.name.length > 3 && 'w-[120px]'} truncate`}>
            {subscriptionList[current]?.pet?.name}
          </Text>
          的专属鲜食食谱
        </View>
        <Swiper
          current={current}
          onChange={(e) => setCurrent(e.detail.current)}
          className="w-full flex items-center overflow-hidden"
          nextMargin="10px"
          previousMargin="10px"
        >
          {subscriptionList.map((item, key) => (
            <SwiperItem key={key}>
              <View className="plan m-auto pt-[10px]">
                <View className="rounded-b-[0.3rem] rounded-tl-[0.3rem]">
                  <View className="px-1 pb-[0.18rem] pt-[0.28rem] w-full inline-block fresh">
                    FRESH编号：{item?.no}
                  </View>
                  <View className="swiperItemCard px-1 pt-0.5 pb-[0.3rem] flex flex-col justify-between text-white">
                    <View className="flex items-center text-[24px]">
                      <View className="ml-0.5 mr-1.5">
                        <AtAvatar
                          size="large"
                          className="w-[1.2rem] h-[1.2rem]"
                          circle
                          image={`${
                            item?.pet?.image ? item?.pet?.image : CDNIMGURL2 + returnPetdefaultImage(item?.pet?.type)
                          }`}
                        />
                      </View>
                      <View className="flex-1 mt-1 pr-2">
                        <View className="text-[36px] flex items-center justify-between">
                          <Text className="w-[250px] truncate">{item?.pet?.name}</Text>{' '}
                          <Text
                            className={`rcciconfont ${
                              item?.pet?.gender === 'MALE'
                                ? 'rccicon-male text-[#FFE3B9]'
                                : 'rccicon-female text-[#D49D28]'
                            } translateText`}
                            style={{
                              fontSize: '0.3rem',
                            }}
                          />
                        </View>
                        <View className="mt-[17px] text-[26px]">
                          {item?.pet?.recentHealth === PetPosture.Emaciated
                            ? '瘦弱'
                            : item?.pet?.recentHealth === PetPosture.Obesity
                            ? '超重'
                            : '标准'}
                          体重&nbsp;&nbsp;{item?.pet?.age}
                        </View>
                        <View className="mt-[0.17rem] text-[26px]">
                          {item?.pet?.breed}&nbsp;&nbsp;{item?.pet?.recentWeight}kg
                        </View>
                      </View>
                    </View>
                    <AtButton
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/freshPlanDetails/index?id=${item?.id}`,
                        })
                      }}
                      className="mx-2.5 h-[67px] rounded-full flex items-center bg-white text-[#96CC39] text-[26px] border-0"
                    >
                      管理计划
                    </AtButton>
                  </View>
                </View>
                <View className="swiperItemScroll flex flex-col">
                  <View className="rounded-full" />
                  <View>
                    <View
                      className="h-full pt-[23px] flex flex-col"
                      style={{
                        boxShadow: '0px 2px 10px -4px #999',
                      }}
                    >
                      <View
                        className="p-1 flex-1"
                        style={{
                          borderBottom: '1px solid #A8DC50',
                        }}
                      >
                        <View className="m-auto flex">
                          <View className="w-[126.63px] h-[126.63px] bg-white rounded-[12px] overflow-hidden">
                            <Image
                              style={{
                                width: '100%',
                                height: '100%',
                              }}
                              className="bg-white"
                              src={item?.productList?.[0]?.variants?.defaultImage}
                            />
                          </View>
                          <View className="ml-1 flex-1">
                            <View className="text=[28px] font-medium mt-1">{item?.productList?.[0]?.name}</View>
                            <View className="text-[22px] text-[#666] mt-0.5">
                              {(item?.productList?.[0]?.description ?? '').replace(/<[^>]+>/gi, '')}
                            </View>
                          </View>
                        </View>
                      </View>
                      <View className="p-1 flex-1">
                        <View className="m-auto flex">
                          <View className="flex items-center justify-center bg-white rounded-[12px] w-[126.63px] h-[126.63px]">
                            <Image
                              style={{
                                width: '0.69rem',
                                height: '0.45rem',
                              }}
                              src={`${CDNIMGURL}order%20logistics.png`}
                            />
                          </View>
                          <View className="ml-1 flex-1">
                            <View className="text=[28px] font-medium">发货驿站</View>
                            <View className="font-medium text-[24px] mt-1 leading-[26px]">
                              下一次将在
                              <Text className="text-[#F69C32]">
                                {moment(item?.createNextDeliveryTime).format('YYYY-MM-DD')}
                              </Text>
                              发货 请注意查收!
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </SwiperItem>
          ))}
        </Swiper>
        {subscriptionList.length > 1 && (
          <View className="flex mt-[39px] items-center justify-center">
            {subscriptionList.map((_, key) => (
              <View
                key={key}
                className={`${
                  current === key ? 'bg-[#fff] w-[25px]' : 'bg-[#e5e5e5] w-[15px]'
                } mx-[0.1rem] h-[15px]  rounded-full`}
              />
            ))}
          </View>
        )}
        <View
          className="mx-3 mt-[39px] py-0.8 rounded-full border-0 flex items-center justify-center bg-color-primary text-white"
          onClick={() => {
            Taro.navigateTo({
              url: '/pages/packageA/choosePet/index',
            })
          }}
        >
          <AtIcon className="mr-0.5" value="clock" size="25" />
          <Text className="text-[34px]">更多定制</Text>
        </View>
        <View className="mt-1 px-[30px]">
          <Step />
          <FreshFoodExperience />
          <LovePetHealth />
          <CommonProblem />
          <View className="h-[750px] mx-[-30px]">
            <Image
              src="https://dtcdata.oss-cn-shanghai.aliyuncs.com/asset/image/home_foot_img.png"
              style={{
                transform: 'translateY(20px)',
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default TextView
