import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { AtButton, AtIcon, AtList, AtListItem } from 'taro-ui'

const Schedule = () => {
  const [PopupOpne, setPopupOpne] = useState(false)

  return (
    <View className="p-1 pb-4 Schedule">
      <View className="bg-white mt-1 pb-1 px-1 boxShadow">
        <View className="py-1">
          <View className="flex justify-between items-end">
            <Text className="text-[34px]">订单信息</Text>
            <Text className="text-[22px] text-[#666]">Fresh编号:20185275063697</Text>
          </View>
          <View className="w-[30px] h-[4px] bg-[#96CC39] mt-1" />
        </View>
        <View className="flex flex flex-col">
          {[1, 2].map((_, key) => (
            <View className="mt-1 flex item-center h-[160px]" key={key}>
              <Image className="mx-1 h-full" src="https://jdc.jd.com/img/200" style={{ width: '1.6rem' }} />
              <View className="h-full flex flex-col justify-center flex-1">
                <View className="font-bold text-[30px]">牛肉泥</View>
                <View className="flex items-center justify-between mt-1 text-[24px] text-[#333]">¥129.00</View>
                <View className="flex items-center justify-end mt-1 text-[20px] text-[#9D9D9D]">X 1</View>
              </View>
            </View>
          ))}
        </View>
        <AtList hasBorder={false} className="mb-1">
          <AtListItem title="商品金额" hasBorder={false} extraText="¥150.00" />
          <AtListItem title="促销折扣" hasBorder={false} extraText="-¥40.00" />
          <AtListItem title="运费" extraText="¥0.00" />
          <View className="flex items-center justify-between py-1.5">
            <View
              className="underline text-[24px]"
              onClick={(e) => {
                e.stopPropagation()
                setPopupOpne(true)
              }}
            >
              <AtIcon className="ml-[30px] mr-[10px]" value="close-circle" size="22" />
              取消计划
            </View>
            <View className="TotalPrice">
              <Text className="item-content__info-title" style={{ color: '#000' }}>
                合计：
              </Text>
              <Text className="item-extra__info" style={{ color: '#D49D28' }}>
                ￥110.00
              </Text>
            </View>
          </View>
        </AtList>
      </View>
      <View className="bg-white mt-1 p-1 pb-2 boxShadow text-[24px]">
        <View className="text-[34px]">发货信息</View>
        <View className="w-[30px] h-[4px] bg-[#96CC39] mt-1" />
        <View className="mt-1">发货日期&nbsp;&nbsp;&nbsp;2022-08-23</View>
        <View className="mt-1">收货地址&nbsp;&nbsp;&nbsp;重庆市渝中区 恒大名都11栋32-16</View>
        <View className="flex mt-2 justify-end">
          <AtButton circle className="w-[228px] h-[64px] leading-[64px] text-[24px] m-0" type="primary">
            修改地址
          </AtButton>
        </View>
      </View>
      <View className="bg-white mt-1 p-1 boxShadow">
        <View className="text-[34px]">发货信息</View>
        <View className="w-[30px] h-[4px] bg-[#96CC39] mt-1" />
        <View className="rounded-[10px] mt-1 text-[22px] text-[#999] border border-solid border-[#E2E2E2]">
          <View className="flex items-center justify-between p-1">
            <View>
              订单编号: 201852750697
              <Text
                className="rounded-[8px] text-black bg-[#EAEAEA] mx-0.5 px-0.5"
                onClick={(e) => {
                  e.stopPropagation()
                  Taro.setClipboardData({
                    data: 'xx',
                  })
                }}
              >
                复制
              </Text>
            </View>
            第2笔
          </View>
          <View
            className="flex item-center h-[160px] p-1"
            style={{
              borderBottom: '1px solid #E2E2E2',
              borderTop: '1px solid #E2E2E2',
            }}
          >
            <Image className="mr-1 h-full" src="https://jdc.jd.com/img/200" style={{ width: '1.6rem' }} />
            <View className="h-full flex flex-col justify-center flex-1">
              <View className="font-bold text-[30px]">牛肉泥</View>
              <View className="flex items-center justify-between mt-1 text-[24px] text-[#333]">¥129.00</View>
              <View className="flex items-center justify-end mt-1 text-[20px] text-[#9D9D9D]">X 1</View>
            </View>
          </View>
          <View className="p-1 text-right text-[24px] text-[#666]">发货日期:2022-08-23</View>
        </View>
      </View>
      {/* 弹出层 */}
      <View
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center"
        style={{
          display: PopupOpne ? 'flex' : 'none',
        }}
        onClick={(e) => {
          e.stopPropagation()
          setPopupOpne(false)
        }}
      >
        <View>
          <View
            className="w-[650px] bg-white rounded-[50px] flex flex-col items-center"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Image className="mt-2" src="https://jdc.jd.com/img/200" style={{ width: '2.36rem', height: '2.36rem' }} />
            <View className="text-[29px] text-[#333] mt-2">您确定要取消这个计划嘛？</View>
            <View className="flex items-center justify-between my-2">
              <AtButton
                circle
                className="w-[190px] h-[60px] leading-[60px] text-[24px] text-white m-0 border-0 bg-[#C8E399]"
              >
                确定
              </AtButton>
              <AtButton
                circle
                className="w-[190px] h-[60px] leading-[60px] text-[24px] text-white m-0 border-0 bg-[#96CC39] ml-2"
                onClick={(e) => {
                  e.stopPropagation()
                  setPopupOpne(false)
                }}
              >
                我在想想
              </AtButton>
            </View>
          </View>
          <View className="flex justify-center mt-3">
            <AtIcon value="close-circle" size={30} color="#fff" />
          </View>
        </View>
      </View>
    </View>
  )
}

export default Schedule
