import { useState } from 'react';
import { View, Text, Input, Image } from '@tarojs/components';
import { PetGender, PetStep, PetType } from '@/framework/types/consumer';
import { AtFloatLayout } from 'taro-ui';
import { UPLOADURL, CDNIMGURL } from '@/lib/constants';
import Taro from '@tarojs/taro';
import PetTitle from './components/PetAddTitle';
import { IProps } from './step1';

import './step.less';

const Step2 = ({ pet, onStepChange, onChange }: IProps) => {
  const [show, setShow] = useState<boolean>(false);
  const { system } = Taro.getSystemInfoSync();
  const androidFlag = system.indexOf('Android') > -1 ? 'android' : 'ios';

  const handleGenderChange = (gender: PetGender) => {
    if (!pet.name) {
      Taro.showToast({ title: '请先设置宠物昵称' })
      return;
    }
    onChange("gender", gender);
    onStepChange(PetStep.STEP3);
  }

  const handleNameChange = (e) => {
    onChange('name', e?.detail?.value);
  }

  const handleNext = () => {
    if (!pet.gender) {
      Taro.showToast({ title: '请先选择宠物性别' })
      return;
    }
    onStepChange(PetStep.STEP3);
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
            setShow(false);
          },
        })
      },
    })
  }

  return (
    <View className="mx-1 pt-2">
      <View className="mt-3 text-center flex justify-center">
        <View className="pet-avatar flex justify-center items-center" onClick={() => setShow(true)}>
          <Image src={pet.image} />
          <Text className={`up-alert rcciconfont rccicon-cam`} />
        </View>
      </View>
      <View className="mt-4">
        <PetTitle>您爱宠的昵称是</PetTitle>
      </View>
      <View className="mt-1 flex justify-between items-center">
        <View className="flex-1">
          <Input value={pet.name} className="rcc-input" onInput={handleNameChange} />
        </View>
      </View>
      <View className="mt-3">
        <PetTitle>您爱宠的性别</PetTitle>
      </View>
      <View className="mt-1 rcc-single-choice flex justify-between items-center">
        <Text
          onClick={() => handleGenderChange(PetGender.Male)}
          className={`rcc-choice-item flex-1 mr-1 text-30 font-bold ${pet.gender === PetGender.Male ? 'active' : ''}`}
        >
          小鲜肉
        </Text>
        <Text
          onClick={() => handleGenderChange(PetGender.Female)}
          className={`rcc-choice-item flex-1 ml-1 text-30 font-bold ${pet.gender === PetGender.Female ? 'active' : ''}`}
        >
          小公主
        </Text>
      </View>
      <View className={`pet-edit-btns ${androidFlag}`}>
        <View className="grid grid-cols-2">
          <Text className="btn-item" onClick={() => onStepChange(PetStep.STEP1)}>上一步</Text>
          <Text className={`btn-item ${!pet.name || !pet.gender ? 'active' : 'strong'}`} onClick={handleNext}>下一步</Text>
        </View>
      </View>
      <AtFloatLayout
        isOpened={show}
        onClose={() => setShow(false)}
      >
        <View className="upload-avatar">
          <View className="mt-2 text-32 font-bold text-center">上传宠物头像</View>
          <View className="mt-3 flex">
            <View className="flex-1 text-center">
              <View className="upload-item" onClick={() => handleUploadFromSource('camera')}>
                <Text className="rcciconfont rccicon-camera text-48 text-color-primary"/>
              </View>
              <View className="mt-1 text-30">去拍照</View>
            </View>
            <View className="flex-1 text-center">
              <View className="upload-item" onClick={() => handleUploadFromSource('album')}>
                <Text className="rcciconfont rccicon-picture text-48 text-color-primary"/>
              </View>
              <View className="mt-1 text-30">相册选择</View>
            </View>
          </View>
          <View className="mt-3">
            <View onClick={() => setShow(false)} className="poper-btn rounded-full text-center bg-color-primary text-32 font-bold text-white">取 消</View>
          </View>
        </View>
      </AtFloatLayout>
    </View>
  );
}

export default Step2;
