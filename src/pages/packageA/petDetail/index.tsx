import { useState } from 'react';
import { View, Text, Image, Input, PickerView, PickerViewColumn } from '@tarojs/components';
import { AtFloatLayout, AtIcon, AtButton } from 'taro-ui';
import Taro from '@tarojs/taro';
import { CDNIMGURL2, CDNIMGURL, UPLOADURL } from '@/lib/constants';
import { getBreedList } from '@/framework/api/pet/get-breeds';
import PetTitle from '@/components/consumer/EditPet/components/PetAddTitle';
import { PetListItemProps, PetType, PetGender, PetHealth, PetPosture } from '@/framework/types/consumer';
import { BreedListItemProps } from '@/pages/packageA/breedList';
import { updatePet } from '@/framework/api/pet/update-pet';
import { getPet } from '@/framework/api/pet/get-pets';
import { deletePet } from '@/framework/api/pet/delete-pet';
import moment from 'moment';
import RccDatePicker from '@/components/common/RccDatePicker';
import { genSeriesNumberArr } from '@/utils/utils';

import '@/components/consumer/EditPet/step.less';
import './index.less';

const arr1 = genSeriesNumberArr(0, 70);
const arr2 = ['.'];
const arr3 = genSeriesNumberArr(0, 9);

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
  const [showBirth, setShowBirth] = useState<boolean>(false);
  const [showDel, setShowDel] = useState<boolean>(false);

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
      count: 1, // ??????9
      sizeType: ['original', 'compressed'], // ?????????????????????????????????????????????????????????
      sourceType: [source], // ????????????????????????????????????????????????????????????
      success: function (res) {
        // ????????????????????????????????????????????????tempFilePath????????????img?????????src??????????????????
        const tempFilePaths = res.tempFilePaths
        Taro.uploadFile({
          url: `${UPLOADURL}`, //???????????????????????????????????????
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
      url: `/pages/packageA/breedList/index?type=${pet.type}`,
      events: {
        seachBreed: function ({ breed, code }) {
          console.log('???????????????---', breed, code)
          //let newPetInfo = Object.assign({}, pet, { breed, code })
          handlePetEdit({ breed, code });
        },
      },
    })
  }

  const handleChangeCurrentWeight = (e) => {
    const cv = e.detail.value;
    if (cv[0] <= 0 && cv[2] <= 0) {
      cv[0] = 1;
    }
    setVal(cv);
    handlePetEdit({'recentWeight': arr1[cv[0] > -1 ? cv[0] : 0] + '.' + arr3[cv[2] > -1 ? cv[2] : 0]});
  }

  const handleChangeTargetWeight = (e) => {
    const cv = e.detail.value;
    if (cv[0] <= 0 && cv[2] <= 0) {
      cv[0] = 1;
    }
    setVal1(cv);
    handlePetEdit({'targetWeight': arr1[cv[0] > -1 ? cv[0] : 0] + '.' + arr3[cv[2] > -1 ? cv[2] : 0]});
  }

  const handlePostureChange = (posture: PetPosture) => {
    if (moment().diff(moment(pet.birthday, 'YYYY-MM-DD'), 'years') >= 1 && posture === PetPosture.Standard) {
      handlePetEdit({
        recentPosture: posture,
        targetWeight: undefined,
      });
    } else {
      handlePetEdit({ recentPosture: posture });
    }
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
    if (!pet.name) {
      Taro.showToast({ title: '????????????????????????' });
      return;
    }
    if ((moment().diff(moment(pet.birthday, 'YYYY-MM-DD'), 'years') < 1 || pet.recentPosture !== PetPosture.Standard) && !pet.targetWeight) {
      Taro.showToast({ title: '????????????????????????' });
      return;
    }
    if (pet.recentPosture === PetPosture.Emaciated && Number(pet.targetWeight) <= Number(pet.recentWeight)) {
      Taro.showToast({ title: '???????????????????????????????????????' });
      return;
    }
    if (pet.recentPosture === PetPosture.Obesity && Number(pet.targetWeight) >= Number(pet.recentWeight)) {
      Taro.showToast({ title: '???????????????????????????????????????' });
      return;
    }
    const res = await updatePet(pet, originalPet);
    if (res) {
      Taro.navigateBack();
    } else {
      Taro.showToast({ title: '????????????' });
    }
  }

  const handleSub = () => {
    Taro.setStorageSync("petItem", pet);
    Taro.navigateTo({
      url: '/pages/foodRecom/index',
    });
  }

  const handleOpenDelete = () => {
    if (pet.subscriptionNo && pet.subscriptionNo.length > 0) {
      Taro.showToast({ title: `${pet.name}?????????????????????????????????` })
      return;
    }
    setShowDel(true);
  }

  const handleDelete = async () => {
    const res = await deletePet({ id: pet.id });
    if (res) {
      Taro.navigateBack();
    }
  }

  const hotBreedList = breedList.filter(el => el.isHot).filter((el, idx) => idx < 9);
  const isOtherBreedSelected = !!pet.code && hotBreedList.map(el => el.code).indexOf(pet.code) === -1;

  return (
    <View className="pet-detail-page">
      <View className="bg-white px-2 py-1 flex items-center">
        <View className="head w-6 h-6 flex-shrink-0" onClick={() => setShowUpload(true)}>
          <Image className="rounded-full" src={pet.image || `${CDNIMGURL}${pet.type === PetType.Cat ? 'cat-default.png' : 'dog-default.png'}`}></Image>
          <Text className={`up-alert rcciconfont rccicon-cam`} />
        </View>
        <View className="flex-1 flex items-center">
          <Text className="ml-1 text-32 truncate max-w-[3rem]">{pet.name}</Text>
          <Text className={`ml-1 rcciconfont text-30 text-color-price ${pet.gender === PetGender.Female ? 'rccicon-female' : 'rccicon-male'}`}></Text>
        </View>
        <View className="pet-delete self-start flex items-center justify-center" onClick={handleOpenDelete}>
          <Text className="rcciconfont rccicon-idelete text-30" />
        </View>
      </View>
      <View className="py-1 bg-white flex justify-around items-center">
        <Text className={`pet-tab-item text-32 ${tab === 1 ? 'active' : ''}`} onClick={() => setTab(1)}>????????????</Text>
        <Text className={`pet-tab-item text-32 ${tab === 2 ? 'active' : ''}`} onClick={() => setTab(2)}>????????????</Text>
      </View>
      <View className="pb-12">
        <View className="tab1 px-1" style={{display: tab === 1 ? 'block' : 'none'}}>
          <View className="mt-3">
            <PetTitle>????????????</PetTitle>
          </View>
          <View className="mt-1">
            <Input className="rcc-input bg-white" value={pet.name} onInput={(e) => handlePetEdit({ name: e.detail.value })} />
          </View>
          <View className="mt-3">
            <PetTitle>????????????</PetTitle>
          </View>
          <View className="mt-1">
            <View className="choose-other-breed bg-white flex items-center" onClick={() => setShowBirth(true)}>
              <Text className="text-28 mx-1 flex-1">{pet.birthday ? pet.birthday.replace('-', '???').replace('-', '???') + '???' : '?????????'}</Text>
              <Text className="rcciconfont rccicon-right text-30 mx-1 text-gray-400" />
            </View>
          </View>
          <View className="mt-3">
            <PetTitle>{pet.name}???</PetTitle>
          </View>
          <View className="mt-1 rcc-single-choice flex justify-between items-center">
            <Text
              onClick={() => handlePetEdit({ 'gender': PetGender.Male})}
              className={`rcc-choice-item bg-white flex-1 mr-1 text-30 ${pet.gender === PetGender.Male ? 'active' : ''}`}
            >
              ?????????
            </Text>
            <Text
              onClick={() => handlePetEdit({ 'gender': PetGender.Female})}
              className={`rcc-choice-item bg-white flex-1 ml-1 text-30 ${pet.gender === PetGender.Female ? 'active' : ''}`}
            >
              ?????????
            </Text>
          </View>
          <View className="mt-3">
            <PetTitle>{pet.name}????????????</PetTitle>
          </View>
          <View className="mt-1 rcc-single-choice grid grid-cols-3">
            {hotBreedList.map((item: BreedListItemProps, index: number) => (
                <Text
                  key={index}
                  className={`rcc-choice-item bg-white text-28 truncate ${pet.code === item.code ? 'active' : ''}`}
                  onClick={() => handlePetEdit({ breed: item.name, code: item.code})}
                >
                  {item.name}
                </Text>
            ))}
          </View>
          <View className={`mt-1 choose-other-breed bg-white flex items-center ${isOtherBreedSelected ? 'active' : ''}`} onClick={handleBreed}>
            <Text className={`text-28 mx-1 flex-1 ${isOtherBreedSelected ? 'text-white' : ''}`}>{isOtherBreedSelected ? pet.breed : '??????????????????'}</Text>
            <Text className={`rcciconfont rccicon-right text-30 mx-1 ${isOtherBreedSelected ? 'text-white' : 'text-gray-400'}`} />
          </View>
        </View>
        <View className="tab2 px-1" style={{display: tab === 2 ? 'block' : 'none'}}>
          <View className="mt-3">
            <PetTitle>{pet.name}???????????????<Text className="ml-1 text-26 font-normal text-gray-400">(kg)</Text></PetTitle>
          </View>
          <View className="mt-1 choose-other-breed bg-white flex items-center" onClick={() => setShow(true)}>
            <Text className="text-28 mx-1 flex-1">{pet.recentWeight ? pet.recentWeight : '?????????'}</Text>
            <Text className="rcciconfont rccicon-right text-30 mx-1 text-gray-400" />
          </View>
          <View className="mt-3">
            <PetTitle>{pet.name}???????????????</PetTitle>
          </View>
          <View className="mt-1 flex items-center pet-situation bg-white">
            <View className={`flex-1 pet-situation-item ${pet.recentPosture === PetPosture.Emaciated ? 'active font-bold' : ''}`} onClick={() => handlePostureChange(PetPosture.Emaciated)}>
              <Image className="my-1" src={`${CDNIMGURL2}weight-thin.png`} />
              <View className="text-24 mb-1">??????</View>
            </View>
            <View className={`flex-1 pet-situation-item ${pet.recentPosture === PetPosture.Standard ? 'active font-bold' : ''}`} onClick={() => handlePostureChange(PetPosture.Standard)}>
              <Image className="my-1" src={`${CDNIMGURL2}weight-std.png`} />
              <View className="text-24 mb-1">??????</View>
            </View>
            <View className={`flex-1 pet-situation-item ${pet.recentPosture === PetPosture.Obesity ? 'active font-bold' : ''}`} onClick={() => handlePostureChange(PetPosture.Obesity)}>
              <Image className="my-1" src={`${CDNIMGURL2}weight-fat.png`} />
              <View className="text-24 mb-1">??????</View>
            </View>
          </View>
          {moment().diff(moment(pet.birthday, 'YYYY-MM-DD'), 'years') >= 1 && pet.recentPosture === PetPosture.Standard ? null : <><View className="mt-3">
            <PetTitle>{pet.name}???????????????????????????<Text className="ml-1 text-26 font-normal text-gray-400">(kg)</Text></PetTitle>
          </View>
          <View className="mt-1 choose-other-breed bg-white flex items-center" onClick={() => setShow1(true)}>
            <Text className="text-28 mx-1 flex-1">{pet.targetWeight ? pet.targetWeight : '?????????'}</Text>
            <Text className="rcciconfont rccicon-right text-30 mx-1 text-gray-400" />
          </View></>}
          <View className="mt-3">
            <PetTitle>{pet.name}?????????????????????<Text className="ml-1 text-26 font-normal text-gray-400">(?????????)</Text></PetTitle>
          </View>
          <View>
            <View
              className={`pet-health-item bg-white my-1 text-28 ${(pet.recentHealth ?? []).indexOf(PetHealth.PICKY_EATER) > -1 ? 'active' : ''}`}
              onClick={() => handleChooseHealth(PetHealth.PICKY_EATER)}
            >
              ??????????????????
            </View>
            <View
              className={`pet-health-item bg-white my-1 text-28 ${(pet.recentHealth ?? []).indexOf(PetHealth.FOOD_ALLERGIES_OR_STOMACH_SENSITIVITIES) > -1 ? 'active' : ''}`}
              onClick={() => handleChooseHealth(PetHealth.FOOD_ALLERGIES_OR_STOMACH_SENSITIVITIES)}
            >
              ????????????????????????
            </View>
            <View
              className={`pet-health-item bg-white my-1 text-28 ${(pet.recentHealth ?? []).indexOf(PetHealth.DULL_OR_FLAKY_FUR) > -1 ? 'active' : ''}`}
              onClick={() => handleChooseHealth(PetHealth.DULL_OR_FLAKY_FUR)}
            >
              ????????????????????????
            </View>
            <View
              className={`pet-health-item bg-white my-1 text-28 ${(pet.recentHealth ?? []).indexOf(PetHealth.ARTHRITIS_OR_JOINT_PAIN) > -1 ? 'active' : ''}`}
              onClick={() => handleChooseHealth(PetHealth.ARTHRITIS_OR_JOINT_PAIN)}
            >
              ?????????????????????
            </View>
            <View
              className={`pet-health-item bg-white my-1 text-28 ${(pet.recentHealth ?? []).indexOf(PetHealth.NONE) > -1 ? 'active' : ''}`}
              onClick={() => handleChooseHealth(PetHealth.NONE)}
            >
              ???????????????
            </View>
          </View>
        </View>
      </View>

      <View className="add-pet-btn">
        <View className="px-1 mt-1 mb-2 flex items-center">
          <View className="flex-1 mx-1 py-0.8 rounded-full bg-color-primary text-white text-30 flex items-center justify-center" onClick={savePet}>
            <Text className="rcciconfont rccicon-save text-32 mr-1"></Text>
            <Text className="text-28">????????????</Text>
          </View>
          {!pet?.subscriptionNo || pet.subscriptionNo.length === 0
            ? <View className="flex-1 mx-1 py-0.8 rounded-full bg-color-primary text-white text-30 flex items-center justify-center" onClick={handleSub}>
            <Text className="rcciconfont rccicon-timer text-32 font-bold mr-1"></Text>
            <Text className="text-28">????????????</Text>
          </View> : null}
        </View>
      </View>

      <RccDatePicker
        visible={showBirth}
        value={pet.birthday}
        onClose={() => setShowBirth(false)}
        onChange={(date) => handlePetEdit({ "birthday": date })}
        onConfirm={() => setShowBirth(false)}
      />

      <AtFloatLayout
        isOpened={showUpload}
        onClose={() => setShowUpload(false)}
      >
        <View className="upload-avatar">
          <View className="mt-2 text-32 font-bold text-center">??????????????????</View>
          <View className="mt-3 flex">
            <View className="flex-1 text-center">
              <View className="upload-item" onClick={() => handleUploadFromSource('camera')}>
                <Text className="rcciconfont rccicon-camera text-48 text-color-primary"/>
              </View>
              <View className="mt-1 text-28">?????????</View>
            </View>
            <View className="flex-1 text-center">
              <View className="upload-item" onClick={() => handleUploadFromSource('album')}>
                <Text className="rcciconfont rccicon-picture text-48 text-color-primary"/>
              </View>
              <View className="mt-1 text-28">????????????</View>
            </View>
          </View>
          <View className="mt-3">
            <View onClick={() => setShowUpload(false)} className="poper-btn rounded-full text-center bg-color-primary text-32 font-bold text-white">??? ???</View>
          </View>
        </View>
      </AtFloatLayout>

      <AtFloatLayout
        isOpened={show}
        onClose={() => setShow(false)}
      >
        <View className="upload-avatar">
          <View className="mt-2 text-32 font-bold text-center">????????????????????????????????????</View>
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
            <View onClick={() => setShow(false)} className="poper-btn rounded-full text-center bg-color-primary text-32 font-bold text-white">??? ???</View>
          </View>
        </View>
      </AtFloatLayout>

      <AtFloatLayout
        isOpened={show1}
        onClose={() => setShow1(false)}
      >
        <View className="upload-avatar">
          <View className="mt-2 text-32 font-bold text-center">????????????????????????????????????</View>
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
            <View onClick={() => setShow1(false)} className="poper-btn rounded-full text-center bg-color-primary text-32 font-bold text-white">??? ???</View>
          </View>
        </View>
      </AtFloatLayout>

      {/* ????????? */}
      <View
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center"
        style={{
          display: showDel ? 'flex' : 'none',
          zIndex: 999,
        }}
        onClick={(e) => {
          e.stopPropagation()
          setShowDel(false)
        }}
      >
        <View>
          <View
            className="w-[650px] bg-white rounded-[50px] flex flex-col items-center"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Image className="mt-2 rounded-full" src={pet.image} style={{ width: '2.36rem', height: '2.36rem' }} />
            <View className="text-[34px] text-[#333] mt-2">????????????????????????????????????</View>
            <View className="flex items-center justify-between my-2">
              <AtButton
                circle
                className="w-[190px] h-[80px] leading-[80px] text-[28px] text-white m-0 border-0 bg-[#C8E399]"
                onClick={handleDelete}
              >
                ??????
              </AtButton>
              <AtButton
                circle
                className="w-[190px] h-[80px] leading-[80px] text-[28px] text-white m-0 border-0 bg-[#96CC39] ml-2"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDel(false)
                }}
              >
                ??????
              </AtButton>
            </View>
          </View>
          <View className="flex justify-center mt-3">
            <Text className="rcciconfont rccicon-close text-white text-48" />
          </View>
        </View>
      </View>
    </View>
  );
}

export default PetDetail;
