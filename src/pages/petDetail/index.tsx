import { useState } from 'react';
import { View, Text, Image, Input, Picker, PickerView, PickerViewColumn } from '@tarojs/components';
import { AtFloatLayout, AtButton } from 'taro-ui';
import Taro from '@tarojs/taro';
import { CDNIMGURL2, CDNIMGURL, UPLOADURL } from '@/lib/constants';
import { getBreedList } from '@/framework/api/pet/get-breeds';
import PetTitle from '@/components/consumer/EditPet/components/PetTitle';
import { PetListItemProps, PetType, PetGender, PetHealth, PetPosture } from '@/framework/types/consumer';
import { BreedListItemProps } from '@/pages/breedList';
import { updatePet } from '@/framework/api/pet/update-pet';
import { getPet } from '@/framework/api/pet/get-pets';
import moment from 'moment';

import '@/components/consumer/EditPet/step.less';
import './index.less';

const arr1 = ['0','1','2','3','4','5','6','7','8','9','10'];
const arr2 = ['.'];
const arr3 = ['0','1','2','3','4','5','6','7','8','9'];

let originalPet: any = {};

const PetDetail = () => {
  const [breedList, setBreedList] = useState<BreedListItemProps[]>([]);
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [tab, setTab] = useState<1 | 2>(1);
  const [pet, setPet] = useState<PetListItemProps>({
    age: '',
    birthday: '',
    breed: '',
    code: '',
    gender: undefined,
    id: '-1',
    image: '',
    isSterilized: false,
    name: '',
    type: undefined,
    recentPosture: PetPosture.Standard,
  });
  const [show, setShow] = useState<boolean>(false);
  const [val, setVal] = useState<number[]>([0,0,0]);
  const [show1, setShow1] = useState<boolean>(false);
  const [val1, setVal1] = useState<number[]>([0,0,0]);

  const getBreedListInit = async (type: PetType | undefined) => {
    let res: any = await getBreedList()
    my.setStorageSync({ key: 'breedList', data: res });
    const ctype = type ? type : 'CAT';
    res = res.filter((el) => el.type === ctype)
    setBreedList(res)    
  }

  Taro.useReady(() => {
    const pages = Taro.getCurrentPages()
    const current = pages[pages.length - 1]
    const eventChannel = current.getOpenerEventChannel()
    eventChannel.on('petFromList', (data: PetListItemProps) => {
      originalPet = data;
      setPet(data);
      getBreedListInit(data.type);
      setVal([arr1.indexOf((data?.recentWeight ?? '')[0]) ?? 0, 0, arr3.indexOf((data?.recentWeight ?? '')[2]) ?? 0]);
      setVal1([arr1.indexOf((data?.targetWeight ?? '')[0]) ?? 0, 0, arr3.indexOf((data?.targetWeight ?? '')[2]) ?? 0]);
      getPet(data.id).then((res: PetListItemProps) => {
        console.log('pet from api:', res);
        if (res) { setPet(res) };
      })
    })
  });

  const handlePetEdit = (obj: Partial<PetListItemProps>) => {
    setPet(Object.assign({}, pet, obj));
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
            handlePetEdit({"image": url});
            setShowUpload(false);
          },
        })
      },
    })
  }

  const handleBreed = () => {
    Taro.navigateTo({
      url: `/pages/breedList/index?type=${pet.type}`,
      events: {
        seachBreed: function ({ breed, code }) {
          console.log('返回的数据---', breed, code)
          //let newPetInfo = Object.assign({}, pet, { breed, code })
          handlePetEdit({ breed, code });
        },
      },
    })
  }

  const handleChangeCurrentWeight = (e) => {
    const cv = e.detail.value;
    setVal(cv);
    handlePetEdit({'recentWeight': arr1[cv[0] > -1 ? cv[0] : 0] + '.' + arr3[cv[2] > -1 ? cv[2] : 0]});
  }

  const handleChangeTargetWeight = (e) => {
    const cv = e.detail.value;
    setVal1(cv);
    handlePetEdit({'targetWeight': arr1[cv[0] > -1 ? cv[0] : 0] + '.' + arr3[cv[2] > -1 ? cv[2] : 0]});
  }

  const handleChooseHealth = (health: PetHealth) => {
    let healthes = pet.recentHealth ?? [];
    const idx = healthes.indexOf(health);
    const noneIdx = healthes.indexOf(PetHealth.NONE);
    if (noneIdx > -1) {
      healthes.splice(noneIdx, 1);
    }
    if (health === PetHealth.NONE) {
      healthes = [health];
    } else if (idx > -1) {
      healthes.splice(idx, 1);
    } else {
      healthes.push(health);
    }
    handlePetEdit({'recentHealth': healthes});
  }

  const savePet = async () => {
    const res = await updatePet(pet, originalPet);
    if (res) {
      Taro.navigateBack();
    } else {
      Taro.showToast({ title: '保存失败' });
    }
  }

  const handleSub = () => {
    Taro.setStorageSync("petItem", pet);
    Taro.redirectTo({
      url: '/pages/foodRecom/index',
    });
  }

  const hotBreedList = breedList.filter(el => el.isHot).filter((el, idx) => idx < 9);
  const isOtherBreedSelected = !!pet.code && hotBreedList.map(el => el.code).indexOf(pet.code) === -1;

  return (
    <View className="pet-detail-page">
      <View className="bg-white px-2 py-1 flex items-center">
        <View className="head w-6 h-6" onClick={() => setShowUpload(true)}>
          <Image className="rounded-full" src={pet.image || `${CDNIMGURL}${pet.type === PetType.Cat ? 'cat-default.png' : 'dog-default.png'}`}></Image>
        </View>
        <Text className="ml-2 text-32">{pet.name}</Text>
        <Text className={`ml-1 rcciconfont text-30 ${pet.gender === PetGender.Female ? 'text-color-primary rccicon-female' : 'text-gray-400 rccicon-male'}`}></Text>
      </View>
      <View className="py-1 bg-white flex justify-around items-center">
        <Text className={`pet-tab-item text-32 ${tab === 1 ? 'active' : ''}`} onClick={() => setTab(1)}>基本信息</Text>
        <Text className={`pet-tab-item text-32 ${tab === 2 ? 'active' : ''}`} onClick={() => setTab(2)}>体征档案</Text>
      </View>
      <View className="pb-12">
        <View className="tab1 px-1" style={{display: tab === 1 ? 'block' : 'none'}}>
          <View className="mt-2">
            <PetTitle>宠物昵称</PetTitle>
          </View>
          <View className="mt-2">
            <Input className="rcc-input bg-white" value={pet.name} onInput={(e) => handlePetEdit({ name: e.detail.value })} />
          </View>
          <View className="mt-2">
            <PetTitle>宠物生日</PetTitle>
          </View>
          <View className="mt-2">
            <Picker
              style={{ borderWidth: '0px !important', backgroundColor: 'transparent !important' }}
              value={pet.birthday}
              mode="date"
              end={new Date().toLocaleString().split(' ')[0].replace(/\//g, '-')}
              onChange={(e) => handlePetEdit({ 'birthday': moment(e.detail.value).format('YYYY-MM-DD') })}
            >
              <View className="choose-other-breed bg-white flex items-center">
                <Text className="text-28 mx-1 flex-1 font-bold">{pet.birthday ? pet.birthday.replace('-', '年').replace('-', '月') + '日' : '请选择'}</Text>
                <Text className="rcciconfont rccicon-right text-34 mx-1" />
              </View>
            </Picker>
          </View>
          <View className="mt-2">
            <PetTitle>{pet.name}是</PetTitle>
          </View>
          <View className="mt-2 rcc-single-choice flex justify-between items-center">
            <Text
              onClick={() => handlePetEdit({ 'gender': PetGender.Male})}
              className={`rcc-choice-item bg-white flex-1 mr-1 text-28 font-bold ${pet.gender === PetGender.Male ? 'active' : ''}`}
            >
              小鲜肉
            </Text>
            <Text
              onClick={() => handlePetEdit({ 'gender': PetGender.Female})}
              className={`rcc-choice-item bg-white flex-1 ml-1 text-28 font-bold ${pet.gender === PetGender.Female ? 'active' : ''}`}
            >
              小公主
            </Text>
          </View>
          <View className="mt-2">
            <PetTitle>{pet.name}的品种是</PetTitle>
          </View>
          <View className="mt-2 rcc-single-choice grid grid-cols-3">
            {hotBreedList.map((item: BreedListItemProps, index: number) => (
                <Text
                  key={index}
                  className={`rcc-choice-item bg-white text-28 font-bold truncate ${pet.code === item.code ? 'active' : ''}`}
                  onClick={() => handlePetEdit({ breed: item.name, code: item.code})}
                >
                  {item.name}
                </Text>
            ))}
          </View>
          <View className={`mt-1 choose-other-breed bg-white flex items-center ${isOtherBreedSelected ? 'active' : ''}`} onClick={handleBreed}>
            <Text className="text-28 mx-1 flex-1 font-bold">{isOtherBreedSelected ? pet.breed : '选择其他品种'}</Text>
            <Text className="rcciconfont rccicon-right text-34 mx-1" />
          </View>
        </View>
        <View className="tab2 px-1" style={{display: tab === 2 ? 'block' : 'none'}}>
          <View className="mt-2">
            <PetTitle>{pet.name}近期的体重<Text className="ml-1 text-22 text-gray-200">(kg)</Text></PetTitle>
          </View>
          <View className="mt-2 choose-other-breed bg-white flex items-center" onClick={() => setShow(true)}>
            <Text className="text-28 mx-1 flex-1 font-bold">{pet.recentWeight ? pet.recentWeight : '请选择'}</Text>
            <Text className="rcciconfont rccicon-right text-34 mx-1" />
          </View>
          <View className="mt-2">
            <PetTitle>{pet.name}近期的体态</PetTitle>
          </View>
          <View className="mt-2 flex items-center pet-situation bg-white">
            <View className={`flex-1 pet-situation-item ${pet.recentPosture === PetPosture.Emaciated ? 'active font-bold' : ''}`} onClick={() => handlePetEdit({ 'recentPosture': PetPosture.Emaciated})}>
              <Image className="my-1" src={`${CDNIMGURL2}weight-thin.png`} />
              <View className="text-24 mb-1">瘦弱</View>
            </View>
            <View className={`flex-1 pet-situation-item ${pet.recentPosture === PetPosture.Standard ? 'active font-bold' : ''}`} onClick={() => handlePetEdit({ 'recentPosture': PetPosture.Standard})}>
              <Image className="my-1" src={`${CDNIMGURL2}weight-std.png`} />
              <View className="text-24 mb-1">标准</View>
            </View>
            <View className={`flex-1 pet-situation-item ${pet.recentPosture === PetPosture.Obesity ? 'active font-bold' : ''}`} onClick={() => handlePetEdit({ 'recentPosture': PetPosture.Obesity})}>
              <Image className="my-1" src={`${CDNIMGURL2}weight-fat.png`} />
              <View className="text-24 mb-1">超重</View>
            </View>
          </View>
          <View className="mt-2">
            <PetTitle>{pet.name}近期的成年目标体重<Text className="ml-1 text-22 text-gray-200">(kg)</Text></PetTitle>
          </View>
          <View className="mt-2 choose-other-breed bg-white flex items-center" onClick={() => setShow1(true)}>
            <Text className="text-28 mx-1 flex-1 font-bold">{pet.targetWeight ? pet.targetWeight : '请选择'}</Text>
            <Text className="rcciconfont rccicon-right text-34 mx-1" />
          </View>
          <View className="mt-2">
            <PetTitle>{pet.name}近期的健康情况<Text className="ml-1 text-22 text-gray-200">(可多选)</Text></PetTitle>
          </View>
          <View>
            <View
              className={`pet-health-item bg-white my-1 text-28 font-bold ${(pet.recentHealth ?? []).indexOf(PetHealth.PICKY_EATER) > -1 ? 'active' : ''}`}
              onClick={() => handleChooseHealth(PetHealth.PICKY_EATER)}
            >
              对食物很挑剔
            </View>
            <View
              className={`pet-health-item bg-white my-1 text-28 font-bold ${(pet.recentHealth ?? []).indexOf(PetHealth.FOOD_ALLERGIES_OR_STOMACH_SENSITIVITIES) > -1 ? 'active' : ''}`}
              onClick={() => handleChooseHealth(PetHealth.FOOD_ALLERGIES_OR_STOMACH_SENSITIVITIES)}
            >
              食物过敏或胃敏感
            </View>
            <View
              className={`pet-health-item bg-white my-1 text-28 font-bold ${(pet.recentHealth ?? []).indexOf(PetHealth.DULL_OR_FLAKY_FUR) > -1 ? 'active' : ''}`}
              onClick={() => handleChooseHealth(PetHealth.DULL_OR_FLAKY_FUR)}
            >
              无光泽或片状被毛
            </View>
            <View
              className={`pet-health-item bg-white my-1 text-28 font-bold ${(pet.recentHealth ?? []).indexOf(PetHealth.ARTHRITIS_OR_JOINT_PAIN) > -1 ? 'active' : ''}`}
              onClick={() => handleChooseHealth(PetHealth.ARTHRITIS_OR_JOINT_PAIN)}
            >
              关节炎或关节痛
            </View>
            <View
              className={`pet-health-item bg-white my-1 text-28 font-bold ${(pet.recentHealth ?? []).indexOf(PetHealth.NONE) > -1 ? 'active' : ''}`}
              onClick={() => handleChooseHealth(PetHealth.NONE)}
            >
              以上都没有
            </View>
          </View>
        </View>
      </View>

      <View className="add-pet-btn">
        <View className="px-1 mt-1 mb-2 flex items-center">
          <View className="flex-1 mx-1 py-0.8 rounded-full bg-color-primary text-white text-30 flex items-center justify-center" onClick={savePet}>
            <Text className="rcciconfont rccicon-save text-32 mr-1"></Text>
            <Text className="text-28">保存编辑</Text>
          </View>
          {!pet?.subscriptionNo || pet.subscriptionNo.length === 0
            ? <View className="flex-1 mx-1 py-0.8 rounded-full bg-color-primary text-white text-30 flex items-center justify-center" onClick={handleSub}>
            <Text className="rcciconfont rccicon-timer text-32 mr-1"></Text>
            <Text className="text-28">开始定制</Text>
          </View> : null}
        </View>
      </View>

      <AtFloatLayout
        isOpened={showUpload}
        onClose={() => setShowUpload(false)}
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
            <View onClick={() => setShowUpload(false)} className="cancel-btn rounded-full text-center h-3 bg-color-primary text-32 text-white">取消</View>
          </View>
        </View>
      </AtFloatLayout>

      <AtFloatLayout
        isOpened={show}
        onClose={() => setShow(false)}
      >
        <View className="upload-avatar">
          <View className="mt-2 text-28 font-bold text-center">选择爱宠近期体重（公斤）</View>
          <View>
            <PickerView
              value={val}
              onChange={handleChangeCurrentWeight}
              className="my-1 mx-6"
              indicatorStyle="height: 50px;"
            >
              <PickerViewColumn>
                {arr1.map(item => <View className="text-34 font-bold">{item}</View>)}
              </PickerViewColumn>
              <PickerViewColumn>
                {arr2.map(item => <View className="text-34 font-bold">{item}</View>)}
              </PickerViewColumn>
              <PickerViewColumn>
                {arr3.map(item => <View className="text-34 font-bold">{item}</View>)}
              </PickerViewColumn>
            </PickerView>
          </View>
          <View className="mb-3">
            <View onClick={() => setShow(false)} className="cancel-btn rounded-full text-center h-3 bg-color-primary text-32 text-white">确定</View>
          </View>
        </View>
      </AtFloatLayout>

      <AtFloatLayout
        isOpened={show1}
        onClose={() => setShow1(false)}
      >
        <View className="upload-avatar">
          <View className="mt-2 text-28 font-bold text-center">选择爱宠目标体重（公斤）</View>
          <View>
            <PickerView
              value={val1}
              onChange={handleChangeTargetWeight}
              className="my-1 mx-6"
              indicatorStyle="height: 50px;"
            >
              <PickerViewColumn>
                {arr1.map(item => <View className="text-34 font-bold">{item}</View>)}
              </PickerViewColumn>
              <PickerViewColumn>
                {arr2.map(item => <View className="text-34 font-bold">{item}</View>)}
              </PickerViewColumn>
              <PickerViewColumn>
                {arr3.map(item => <View className="text-34 font-bold">{item}</View>)}
              </PickerViewColumn>
            </PickerView>
          </View>
          <View className="mb-3">
            <View onClick={() => setShow1(false)} className="cancel-btn rounded-full text-center h-3 bg-color-primary text-32 text-white">确定</View>
          </View>
        </View>
      </AtFloatLayout>
    </View>
  );
}

export default PetDetail;
