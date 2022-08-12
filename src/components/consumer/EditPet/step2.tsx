import { useState } from 'react';
import { View, Text, Input, Image } from '@tarojs/components';
import { PetGender, PetStep } from '@/framework/types/consumer';
import { AtFloatLayout } from 'taro-ui';
import { UPLOADURL } from '@/lib/constants';
import Taro from '@tarojs/taro';
import PetTitle from './components/PetTitle';
import { IProps } from './step1';

import './step.less';

const Step2 = ({ pet, onStepChange, onChange }: IProps) => {
  const [visible, setVisible] = useState<boolean>(!!pet.name);
  const [show, setShow] = useState<boolean>(false);

  const handleGenderChange = (gender: PetGender) => {
    onChange("gender", gender);
    onStepChange(PetStep.STEP3);
  }

  const handleNameChange = (e) => {
    onChange('name', e?.detail?.value);
  }

  const handleComplete = () => {
    setVisible(!!pet.name);
  }

  const handleUploadFromSource = (source: keyof Taro.chooseImage.sourceType) => {
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [source], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        Taro.uploadFile({
          url: `${UPLOADURL}`, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          header: { 'Content-Type': 'multipart/form-data' },
          name: 'file',
          success(vla: any) {
            const { url } = JSON.parse(vla.data)
            console.log('url', url)
            onChange("image", url);
          },
        })
      },
    })
  }

  return (
    <View className="mx-1 mt-2">
      <View className="mt-3 text-center flex justify-center">
        <View className="pet-avatar flex justify-center items-center" onClick={() => setShow(true)}>
          {pet.image
            ? <Image src={pet.image} />
            : <Text className="rcciconfont rccicon-dog2"></Text>}
        </View>
      </View>
      <View className="mt-4">
        <PetTitle>您爱宠的昵称是</PetTitle>
      </View>
      <View className="mt-2 flex justify-between items-center">
        <View className="flex-1">
          <Input className="rcc-input" onInput={handleNameChange} />
        </View>
        <Text onClick={handleComplete} className="rcciconfont rccicon-success text-color-primary ml-2 text-48"></Text>
      </View>
      {visible ? <><View className="mt-2">
        <PetTitle>{pet.name}的性别</PetTitle>
      </View>
      <View className="mt-2 rcc-single-choice flex justify-between items-center">
        <Text
          onClick={() => handleGenderChange(PetGender.Male)}
          className={`rcc-choice-item flex-1 mr-1 text-28 font-bold ${pet.gender === PetGender.Male ? 'active' : ''}`}
        >
          小鲜肉
        </Text>
        <Text
          onClick={() => handleGenderChange(PetGender.Female)}
          className={`rcc-choice-item flex-1 ml-1 text-28 font-bold ${pet.gender === PetGender.Female ? 'active' : ''}`}
        >
          小公主
        </Text>
      </View></> : null}
      <View className="pet-edit-btns">
        <View className="grid grid-cols-2">
          <Text className="btn-item" onClick={() => onStepChange(PetStep.STEP1)}>上一步</Text>
        </View>
      </View>
      <AtFloatLayout
        isOpened={show}
        onClose={() => setShow(false)}
      >
        <View className="upload-avatar">
          <View className="mt-2 text-28 font-bold text-center">上传宠物头像</View>
          <View className="mt-3 flex">
            <View className="flex-1 text-center">
              <View className="upload-item" onClick={() => handleUploadFromSource('camera')}>
                <Text className="rcciconfont rccicon-camera text-48 text-color-primary"/>
              </View>
              <View className="mt-1 text-28">去拍照</View>
            </View>
            <View className="flex-1 text-center">
              <View className="upload-item" onClick={() => handleUploadFromSource('album')}>
                <Text className="rcciconfont rccicon-picture text-48 text-color-primary"/>
              </View>
              <View className="mt-1 text-28">相册选择</View>
            </View>
          </View>
          <View className="mt-3">
            <View onClick={() => setShow(false)} className="cancel-btn rounded-full text-center h-3 bg-color-primary text-32 text-white">取消</View>
          </View>
        </View>
      </AtFloatLayout>
    </View>
  );
}

export default Step2;
