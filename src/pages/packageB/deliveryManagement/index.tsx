import CommonTitle from '@/components/creatSubscription/CommonTitle'
import PetList from '@/components/customer/PetList'
import IconFont from '@/iconfont'
import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import './index.less'
const DeliveryManagement = () => {
    const handleClick = () => {

    }
    return <View className="delivery-management rc-content-bg">
        <View className="px-3 bg-white  rounded-md">
            <PetList />
        </View>
        <View className="px-3 mt-3 bg-white pb-3  rounded-md">
            <CommonTitle title="发货管理" />
            <View className="h-36 flex">
                <View className="w-36 h-full">
                    <Image src="" className="w-full h-full" />
                </View>
                <View className="flex-1 px-3 flex-col flex items-center w-full justify-center">
                    <View className="text-28 text-center mb-3 font-bold">您的宠物还剩余<Text className="text-primary-red">3</Text>包</View>
                    <AtButton
                        size="small"
                        className="w-full"
                        circle
                        type='primary'
                        onClick={handleClick}
                    >
                        一键续订
                    </AtButton>
                </View>
            </View>
            <CommonTitle title="发货驿站" />
            <View>
                <View className="flex justify-between items-center">
                    <IconFont name="fahuoyizhan" size={80} />
                    <View className="text-24 text-right">
                        下一包将在2022-03-18发货，请注意查收!
                    </View>
                </View>
                <View className="flex">
                    <View className="w-36"></View>
                    <View className="flex-1 flex  px-3 w-full">
                        <AtButton
                            size="small"
                            className="w-full"
                            circle
                            type='primary'
                            onClick={() => {
                                Taro.navigateTo({ url: `/pages/packageB/deliveryProgress/index` })

                            }}
                        >
                            发货进度
                        </AtButton>
                    </View>
                </View>
            </View>
        </View>
    </View>
}
export default DeliveryManagement