import { CDNIMGURL } from '@/lib/constants'
import { Image, ScrollView, Text, View } from '@tarojs/components'
import { AtButton, AtList, AtListItem } from 'taro-ui'
import './index.less'
import TimeLine from './timeLine'

const OrderDetails = () => {
  return (
    <ScrollView scrollY overflow-anchor={false} className="pb-1 OrderDetails">
      <View className="bg-white">
        <View className="mx-2 mt-1 py-0.5 flex items-center header">
          <Image
            className="h-full mr-1 headerImage"
            src={`${CDNIMGURL}${1 === 1 ? 'to%20be%20paid.png' : 'to%20be%20shipped.png'}`}
          />
          <View className="flex flex-col">
            <Text>等待买家付款</Text>
            <Text>商家会在七天内发货</Text>
          </View>
        </View>
        <TimeLine />
        <View className="pl-4 py-1 mt-0.5 receiving" style={{ borderTop: '1px solid #EBEBEB' }}>
          <View className="receivingUser">收货人： 王 15096508890</View>
          <View className="receivingAddress mt-0.5">收货地址：重庆 市辖区 江北区 观音桥344</View>
        </View>
      </View>
      <View className="bg-white mt-1 orderAtCard px-1">
        <View className="orderAtCardTitle">订单信息</View>
        <View className="my-2 flex orderAtCardBody">
          <Image className="orderAtCardImage mx-1 h-full rounded-full" src="https://jdc.jd.com/img/200" />
          <View className="h-full flex flex-col justify-between flex-1 " style={{ fontWeight: 700 }}>
            <View>鸡肉料理</View>
            <View className="flex items-center justify-between">
              <Text style={{ color: '#D49D28' }}>
                <Text className="orderAtCardPrice">￥15.</Text>00
              </Text>
              <Text style={{ color: '#9D9D9D', fontWeight: 400 }}>X 1</Text>
            </View>
          </View>
        </View>
      </View>
      <AtList className="my-1">
        <AtListItem title="配送方式" extraText="快递￥0.00" />
        <AtListItem title="买家留言" extraText="无" />
      </AtList>
      <AtList className="mb-1">
        <AtListItem title="商品金额" extraText="￥150.00" />
        <AtListItem title="折扣" extraText="-￥40.00" />
        <AtListItem title="运费" extraText="-￥20.00" />
        <View className="flex justify-end py-1.5">
          <Text className="TotalPrice">
            <Text className="item-content__info-title" style={{ color: '#000' }}>
              合计：
            </Text>
            <Text className="item-extra__info" style={{ color: '#D49D28' }}>
              ￥90.00
            </Text>
          </Text>
        </View>
      </AtList>
      <View className="orderInfo bg-white px-1 py-1.5 mb-3">
        <View>
          <Text>订单编号：</Text>
          <Text>E2022072614122210552750697</Text>
        </View>
        <View>
          <Text>Fresh编号：</Text>
          <Text>S20185275063697</Text>
        </View>
        <View>
          <Text>付款方式：</Text>
          <Text>花呗支付</Text>
        </View>
        <View>
          <Text>付款时间：</Text>
          <Text>2022-07-26 14: 52: 22</Text>
        </View>
        <View>
          <Text>创建时间：</Text>
          <Text>2022-07-26 14: 52: 22</Text>
        </View>
      </View>
      <View className="pt-1 pb-1.5 bg-white orderFooter">
        {/* <View className="flex items-center justify-end">
          <View>
            <Text style={{ fontWeight: 700 }}>合计：</Text>
            <Text className="footerPrice">￥7.50</Text>
          </View>
          <AtButton className="rounded-full m-0 ml-1 px-2" type="primary">
            去支付
          </AtButton>
        </View> */}
        <View className="flex items-center justify-end">
          <AtButton className="rounded-full m-0 px-1.5 py-0">催发货</AtButton>
          <AtButton className="rounded-full m-0 ml-1 px-1.5 py-0">修改地址</AtButton>
        </View>
      </View>
    </ScrollView>
  )
}

export default OrderDetails
