import { View, Text, Image, Input } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import RccRadio from '@/components/common/RccRadio';

export interface IProps {
  pet: any;
  onStepChange: (step: 25 | 50 | 75 | 100) => void;
}

const Step1 = ({ pet, onStepChange }: IProps) => {

  const handleBreed = () => {
    console.log('xxxxxxxxx')
    my.navigateTo({
      url: `/pages/packageB/breedList/index?type=CAT`,
      // events: {
      //   seachBreed: function ({ breed, code }) {
      //     console.log('返回的数据---', breed, code)
      //     let newPetInfo = Object.assign({}, petInfo, { breed, code })
      //     setPetInfo(newPetInfo)
      //   },
      // },
    })
  }

  return (
    <View className="mx-1">
      <Text className="page-title my-2 text-40 font-bold">基本信息</Text>
      <View>
        <Text className="mt-2 text-28">为您的宠物上传一张头像</Text>
        <View className="mt-1">
          <Image
            style={{width:'2.5rem',height:'2.5rem'}}
            mode="scaleToFill"
            src="https://dtcdata.oss-cn-shanghai.aliyuncs.com/asset/image/default-head.png"
          />
        </View>
        <Text className="mt-2 text-28">它是一只</Text>
        <View className="mt-1">
          <RccRadio value='1' checked={false} text="猫"  />
        </View>
        <Text className="mt-2 text-28">您的宠物叫什么名字？</Text>
        <View className="mt-1">
          <Input
            className="rcc-input border-1 border-solid border-gray-300 rounded-xs h-3 w-full"
          />
        </View>
        <Text className="mt-2 text-28">xxx 是</Text>
        <View className="mt-1"></View>
        <Text className="mt-2 text-28">宠物品种</Text>
        <View className="mt-1" onClick={handleBreed}>
          <Input
            className="rcc-input border-1 border-solid border-gray-300 rounded-xs h-3 w-full"
            disabled
          />
        </View>
        <View className="mt-2" style={{display:'inline-block'}}>
          <AtButton
            className="w-8 mt-1"
            customStyle={{ fontSize: '.35rem' }}
            type="primary"
            onClick={() => onStepChange(50)}
          >
            下一步
          </AtButton>
        </View>
      </View>
    </View>
  )
}

export default Step1;
