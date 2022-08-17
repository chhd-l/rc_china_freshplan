import IconFont from '@/components/iconfont'
import { CDNIMGURL } from '@/lib/constants'
import { Image, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import { useState } from 'react'
import { AtAvatar, AtButton, AtIcon } from 'taro-ui'
import './index.less'

const TextView = () => {
  const [current, setCurrent] = useState(0)

  return (
    <View className="oldUserPlan">
      <IconFont name="icon-riqi" size={40} />
      <View className="px-3 py-2 title">
        <Image className="mr-0.5" src={`${CDNIMGURL}claws.png`} />
        <Text>球球</Text>的专属鲜食食谱
      </View>
      <Swiper
        current={current}
        onChange={(e) => setCurrent(e.detail.current)}
        className="w-full flex items-center overflow-hidden"
        nextMargin="10px"
        previousMargin="32px"
      >
        {[1, 2].map((_, key) => (
          <SwiperItem key={key}>
            <View className="plan">
              <View className="p-1 pr-2 inline-block fresh">FRESH编号：S20185275063697</View>
              <View className="swiperItemCard px-1 pt-1 pb-1.5 flex flex-col justify-between text-white">
                <View className="flex text-[24px]">
                  <View className="pt-1 mr-1">
                    <AtAvatar size="large" circle image="https://jdc.jd.com/img/200" />
                  </View>
                  <View className="flex-1 pr-2">
                    <View className="text-[36px] flex items-center justify-between">
                      球球{' '}
                      <Text
                        className={`rcciconfont ${
                          key === 0 ? 'rccicon-male text-[#FFE3B9]' : 'rccicon-female text-[#D49D28]'
                        } translateText`}
                        style={{
                          fontSize: '0.3rem',
                        }}
                      />
                    </View>
                    <View className="mt-1.5">正常体重&nbsp;&nbsp;不到1岁</View>
                    <View className="mt-1">爱尔兰雪达犬&nbsp;&nbsp;5kg</View>
                  </View>
                </View>
                <AtButton className="mx-2.5 h-[67px] rounded-full flex items-center bg-white text-[#96CC39] text-[24px]">
                  开始计划
                </AtButton>
              </View>
              <View className="swiperItemScroll flex flex-col">
                <View className="rounded-full" />
                <View>
                  <View className="h-full pt-[23px] flex flex-col">
                    <View
                      className="p-1 flex-1"
                      style={{
                        borderBottom: '1px solid #A8DC50',
                      }}
                    >
                      <View className="m-auto flex">
                        <View className="w-[126.63px] h-[126.63px] rounded-[12px] overflow-hidden">
                          <Image
                            style={{
                              width: '100%',
                              height: '100%',
                            }}
                            src="https://jdc.jd.com/img/200"
                          />
                        </View>
                        <View className="ml-1 flex-1">
                          <View className="text=[28px] font-medium">专属鲜食</View>
                          <View className="font-medium text-[24px] mt-1">牛肉泥</View>
                          <View className="text-[16px] text-[#666] mt-0.5">牛肉、土豆、鸡蛋、胡萝卜、豌豆</View>
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
                            下一次将在<Text className="text-[#F69C32]">2022-08-23</Text>发货 请注意查收!
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
      <View className="flex mt-1 mb-2 items-center justify-center">
        {[1, 2].map((_, key) => (
          <View
            key={key}
            className={`${
              current === key ? 'bg-[#96CC39] w-[25px]' : 'bg-[#e5e5e5] mx-[0.1rem]'
            } w-[15px] h-[15px]  rounded-full`}
          />
        ))}
      </View>
      <AtButton className="mx-4 rounded-full flex items-center" type="primary">
        <AtIcon className="mr-1" value="clock" size="26" />
        更多定制
      </AtButton>
    </View>
  )
}

export default TextView
