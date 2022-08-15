import { View, Text } from '@tarojs/components';

import './index.less';

const Checkout = () => {
  return (
    <View className="checkout-page pt-2">
      <View className="bg-white rounded-sm mx-1 py-1 px-1">
        <View className="py-1 flex justify-between items-center">
          <View className="flex items-center">
            <Text className="rcciconfont rccicon-location text-32"></Text>
            <Text className="ml-1 text-28 font-bold">添加收获地址</Text>
          </View>
          <Text className="rcciconfont rccicon-right text-22 text-gray-400"></Text>
        </View>
      </View>
    </View>
  );
}

export default Checkout;
