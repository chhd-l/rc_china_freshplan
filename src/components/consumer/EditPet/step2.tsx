import { View, Text, Input } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import { IProps } from './step1';

const Step2 = ({ pet, onStepChange }: IProps) => {
  return (
    <View className="mx-1">
      <Text className="page-title my-2 text-40 font-bold">基本信息</Text>
      <View>
        <Text className="mt-2 text-28">xxx 的体重是多少</Text>
        <View className="mt-1">
          <Input
            className="rcc-input border-1 border-solid border-gray-300 rounded-xs h-3 w-full"
          />
        </View>
        <Text className="mt-2 text-28">xxx 几岁？</Text>
        <View className="mt-1 flex items-center justify-between">
          <View className="flex-1 mr-1">
            <Input
              className="rcc-input border-1 border-solid border-gray-300 rounded-xs h-3 w-full"
            />
          </View>
          <View className="flex-1 ml-1">
            <Input
              className="rcc-input border-1 border-solid border-gray-300 rounded-xs h-3 w-full"
            />
          </View>
        </View>
        <View className="mt-2" style={{display:'inline-block'}}>
          <AtButton
            className="w-8 mt-1"
            customStyle={{ fontSize: '.35rem' }}
            type="primary"
            onClick={() => onStepChange(75)}
          >
            下一步
          </AtButton>
        </View>
      </View>
    </View>
  );
}

export default Step2;
