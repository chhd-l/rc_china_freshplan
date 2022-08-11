import { View, Text } from '@tarojs/components';
import './index.less';

const PetTitle = (props: any) => {
  return (
    <View className="pet-title flex items-center text-28 font-bold">
      <Text className="anchor"></Text>
      <Text>{props.children}</Text>
    </View>
  );
}

export default PetTitle;
