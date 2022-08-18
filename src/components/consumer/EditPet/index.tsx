import { PetGender, PetListItemProps, PetType } from '@/framework/types/consumer'
import { Form, Input, Picker, Text, View } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { addPet } from '@/framework/api/pet/add-pet'
import { AtIcon, AtList, AtListItem, AtToast } from 'taro-ui'
import { updatePet } from '@/framework/api/pet/update-pet'
import birthdayIcon from '@/assets/icons/pet/birthday.png'
import breedIcon from '@/assets/icons/pet/breed.png'
import genderIcon from '@/assets/icons/pet/gender.png'
import nicknameIcon from '@/assets/icons/pet/nickname.png'
import sterilizedIcon from '@/assets/icons/pet/sterilized.png'
import cloneDeep from 'lodash.cloneDeep'
import SingleChoice from '../SingleChoice'
import './index.less'

interface EditPetProps {
  pet: PetListItemProps
  getList: () => void
  SetshowAddPetBtn: (val: boolean) => void
  setIsEdit: (val: boolean) => void
  petList: PetListItemProps[]
  setPetList: (val: PetListItemProps[]) => void
  petItem: PetListItemProps
}
const typeOption = [
  { label: '喵星人', value: PetType.Cat },
  { label: '汪星人', value: PetType.Dog },
]
const genderOption = [
  { label: '公', value: PetGender.Male },
  { label: '母', value: PetGender.Female },
]
const isSterilizedOption = [
  { label: '是', value: true },
  { label: '否', value: false },
]
const EditPet = ({ pet, petItem, getList, SetshowAddPetBtn, setIsEdit, petList, setPetList }: EditPetProps) => {
  const [petInfo, setPetInfo] = useState<PetListItemProps>(cloneDeep(pet))
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { system } = Taro.getSystemInfoSync()
  const systemType = system.indexOf('Android') > -1
  const handleSave = async () => {
    console.info('petInfo', petInfo)
    if (!petInfo.name || !petInfo.breed || !petInfo.birthday) {
      setIsOpen(true)
      return
    }
    if (petInfo.id === '-1') {
      await addPet({ ...petInfo, image: petItem.image })
    } else {
      await updatePet(petInfo, petItem)
    }
    getList()
    handleCancel()
  }
  const handleChange = (name, value) => {
    petInfo[name] = value
  }
  const handleChangeDate = (e) => {
    petInfo.birthday = e.detail.value
    setPetInfo(cloneDeep(petInfo))
  }
  const handleBreed = () => {
    Taro.navigateTo({
      url: `/pages/packageA/breedList/index?type=${petInfo.type}`,
      events: {
        seachBreed: function ({ breed, code }) {
          console.log('返回的数据---', breed, code)
          let newPetInfo = Object.assign({}, petInfo, { breed, code })
          setPetInfo(newPetInfo)
        },
      },
    })
  }
  const handleCancel = () => {
    SetshowAddPetBtn(true) // add
    if (petInfo.id === '-1') {
      if (petList.length === 1) {
        Taro.switchTab({
          url: '/pages/account/index',
        })
        return
      }
      petList.pop()
      setPetList(cloneDeep(petList))
    }
    setIsEdit(false) //edit
  }
  return (
    <View
      className="px-2 bg-white edit-pet  mx-3 pb-2 relative"
      style={{ zIndex: 0 }}
      // style={{
      //   boxShadow:
      //     '0 15px 17px -14px rgba(0, 0, 0, 0.3)inset',
      // }}
    >
      <View
        style={{
          width: '100%',
          height: '13px',
          boxShadow: '0px 6px 12px -5px black',
          position: 'relative',
          top: '-13px',
          zIndex: 0,
          background: 'transparent',
        }}
      ></View>
      <View className="pt-4 ">
        <SingleChoice
          label={
            <View className="col-span-4 flex items-center text-22">
              <View
                className="w-4 h-4 bg-contain bg-no-repeat"
                style={{
                  backgroundImage: 'url(https://dtc-platform.oss-cn-shanghai.aliyuncs.com/static/pet_type.png)',
                }}
              ></View>
              <Text className="pl-2 ">宠物类型</Text>
            </View>
          }
          setPetInfo={setPetInfo}
          options={typeOption}
          name="type"
          pet={petInfo}
        />
        {/* 宠物昵称 */}
        <View className="grid grid-cols-12 text-22 mb-3 h-8">
          <View className="col-span-4 flex items-center">
            <View
              className="w-4 h-4 bg-contain bg-no-repeat"
              style={{ backgroundImage: `url(${nicknameIcon})` }}
            ></View>
            <Text className="pl-2 ">宠物昵称</Text>
          </View>
          <Input
            className="col-span-8 border-2 border-solid border-gray-300 rounded-lg px-2 h-full flex items-center"
            name="name"
            value={petInfo.name}
            onBlur={(e) => {
              console.info('valuevalue', e.detail.value)
              handleChange('name', e.detail.value)
            }}
            type="text"
            placeholder="点击输入宠物名"
          />
        </View>
        {/* 宠物品种 */}
        <View className="grid grid-cols-12 text-22 relative mb-3 h-8">
          <View className="col-span-4 flex items-center">
            <View className="w-4 h-4 bg-contain" style={{ backgroundImage: `url(${breedIcon})` }}></View>
            <Text className="pl-2 ">宠物品种</Text>
          </View>
          <Input
            className="col-span-8 border-2 border-solid border-gray-300 rounded-lg px-2 h-full flex items-center"
            name="breed"
            value={petInfo.breed}
            disabled
            onClick={handleBreed}
            // onInput={(e) => {
            //   console.info("valuevalue", e.detail.value);
            //   handleChange("breed", e.detail.value);
            // }}
            type="text"
            placeholder="点击选择宠物品种"
          />
          <AtIcon
            value="chevron-down"
            size="24"
            color="#d33024"
            className="right-1 absolute"
            customStyle={{ transform: 'translateY(-50%)', top: '50%' }}
          ></AtIcon>
        </View>
        {/* 宠物性别 */}
        <SingleChoice
          label={
            <View className="col-span-4 flex items-center text-22">
              <View className="w-4 h-4 bg-contain" style={{ backgroundImage: `url(${genderIcon})` }}></View>
              <Text className="pl-2 ">宠物性别</Text>
            </View>
          }
          options={genderOption}
          name="gender"
          pet={petInfo}
        />
        {/* 是否绝育 */}
        <SingleChoice
          label={
            <View className="col-span-4 flex items-center text-22">
              <View className="w-4 h-4 bg-contain" style={{ backgroundImage: `url(${sterilizedIcon})` }}></View>
              <Text className="pl-2 ">是否绝育</Text>
            </View>
          }
          options={isSterilizedOption}
          name="isSterilized"
          pet={petInfo}
        />
        {/* 宠物生日 */}
        <View className={`${systemType ? 'isandroid' : 'isios'} date-item border-0 grid grid-cols-12 text-22 relative`}>
          <View className="col-span-4 flex items-center">
            <View className="w-4 h-4 bg-contain" style={{ backgroundImage: `url(${birthdayIcon})` }}></View>
            <Text className="pl-2 ">宠物生日</Text>
          </View>
          <View
            style={{ borderWidth: '2rpx !important' }}
            className="col-span-8 border-solid border-gray-300 rounded-lg px-2 flex items-center h-8"
          >
            <Picker
              style={{ borderWidth: '0px !important', backgroundColor: 'transparent !important' }}
              mode="date"
              className="flex-1 PickerItem w-full h-full flex items-center"
              end={new Date().toLocaleString().split(' ')[0].replace(/\//g, '-')}
              onChange={handleChangeDate}
            >
              <AtList className="border-0 w-full h-full bg-transparent">
                <AtListItem className="text-xl bg-transparent" title="请选择生日" extraText={petInfo.birthday} />
              </AtList>
            </Picker>
          </View>
          <AtIcon
            value="chevron-down"
            size="24"
            color="#d33024"
            className="right-1 absolute"
            customStyle={{ transform: 'translateY(-50%)', top: '50%' }}
          ></AtIcon>
        </View>
      </View>
      <View className="text-30 my-4 flex justify-around">
        <View
          onClick={() => {
            handleCancel()
          }}
          className="inline-block px-8 py-2 rounded-full text-gray-600 bg-gray-200"
        >
          取消
        </View>
        <View onClick={handleSave} className="inline-block px-8 py-2 rounded-full text-white bg-red-600">
          保存
        </View>
      </View>
      <AtToast
        isOpened={isOpen}
        duration={1200}
        text="请填写宠物完整信息"
        icon="close"
        onClose={() => setIsOpen(false)}
      />
    </View>
  )
}
export default EditPet
