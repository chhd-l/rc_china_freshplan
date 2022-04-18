import { View } from "@tarojs/components";
import { formatMoney } from "@/utils/utils";

const Remark = ({
  totalPrice,
  shipPrice,
  discountPrice,
}: {
  totalPrice: number;
  shipPrice: number;
  discountPrice: number;
}) => {
  return (
    <View className="bg-gray-50 mt-2 p-2 text-xs text-gray-400">
      <View className="flex flex-row justify-between items-center">
        <View>商品总价</View>
        <View>{formatMoney(totalPrice)}</View>
      </View>
      <View className="flex flex-row justify-between items-center">
        <View>运费</View>
        <View>{formatMoney(shipPrice)}</View>
      </View>
      <View className="flex flex-row justify-between items-center">
        <View>店铺优惠</View>
        <View>{formatMoney(discountPrice)}</View>
      </View>
    </View>
  );
};
export default Remark;