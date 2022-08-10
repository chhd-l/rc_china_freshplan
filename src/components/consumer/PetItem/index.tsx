import { View, Image, Button } from '@tarojs/components'
import { AtIcon, AtModal, AtModalAction, AtModalContent, AtSwipeAction } from 'taro-ui'
import { Cat, Dog, petBg, UPLOADURL } from '@/lib/constants'
import Taro from '@tarojs/taro'
import cloneDeep from 'lodash.cloneDeep'
import { useEffect, useState } from 'react'
import EditPet from '@/components/consumer/EditPet'
import { editPetButton } from '@/lib/consumer'
import { deletePet } from '@/framework/api/pet/delete-pet'
import { PetListItemProps } from '@/framework/types/consumer'
import './index.less'

interface Props {
  pet: PetListItemProps
  petIdx: number
  petList: PetListItemProps[]
  setPetList: (val: PetListItemProps[]) => void
  SetshowAddPetBtn: (val: boolean) => void
  showAddPetBtn: boolean
  getList: () => void
}
const PetItem = ({ pet, petIdx, petList, setPetList, SetshowAddPetBtn, showAddPetBtn, getList }: Props) => {
  const [editActive, setEditActive] = useState<number>(-1)
  const [imgUrl, setImgUrl] = useState<string>(pet.image)
  const [item, setItem] = useState<any>(pet)
  const [showDelModal, setShowDelModal] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)

  useEffect(() => {
    //add 的时候编辑启用
    console.log('pet', pet)
    !showAddPetBtn && petIdx === petList.length - 1 && setIsEdit(true)
  }, [showAddPetBtn, isEdit])

  const handleClick = (option, idx) => {
    if (option.text == '编辑') {
      setIsEdit(true)
    } else if (option.text === '删除') {
      setShowDelModal(true)
    }
    setEditActive(idx)
  }

  const comfirmDel = async () => {
    let { id } = petList[editActive]
    await deletePet({ id })
    setShowDelModal(false)
    getList()
  }

  const showEdit = (idx) => {
    console.info('...', idx)
    if (!petList[idx].isOpened) {
      petList.forEach((el) => {
        el.isOpened = false
      })
    }
    petList[idx].isOpened = !petList[idx].isOpened
    setPetList(cloneDeep(petList))
  }

  const handleImage = () => {
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
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
            setItem({
              ...item,
              image: url,
            })
            setImgUrl(url)
            //do something
          },
        })
      },
    })
  }

  return (
    <View className="PetItemContainer">
      <View className="overflow-hidden relative" style={{ zIndex: 1 }}>
        <AtSwipeAction
          className="PetItem"
          autoClose
          onClick={(val) => {
            console.log('val', val)
            handleClick(val, petIdx)
          }}
          onOpened={() => {
            showEdit(petIdx)
          }}
          disabled={isEdit}
          isOpened={false}
          options={editPetButton}
          maxDistance={120}
          areaWidth={my.getSystemInfoSync().windowWidth * 0.9}
        >
          <View
            className="text-center w-screen bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${petBg})`, padding: '30px 0' }}
            onClick={() => {
              showEdit(petIdx)
            }}
          >
            <View
              className={`w-rc190 ${
                pet.image ? ' bg-white   image-pad shadow-little' : ''
              } h-rc190 rounded-full  flex items-center justify-center m-auto `}
            >
              <Image
                src={pet.image || (pet.type === 'DOG' ? Dog : Cat)}
                // style={{ borderRadius: '50%' }}
                className="w-full h-full m-auto Petpictureshadow rounded-full"
              />
            </View>
            <View className="flex justify-center pt-rc30">
              <View className="text-rc28 text-red-600 pr-rc30 font-medium">阿猫</View>
              <View className="text-rc20 flex items-center">
                <View className="mr-rc10">短毛猫</View>
                <View>11月</View>
              </View>
            </View>
          </View>
        </AtSwipeAction>
      </View>
      <AtModal
        key="shipnow"
        isOpened={showDelModal}
        title="提示"
        content="确定删除宠物信息？"
        confirmText="狠心删除"
        cancelText="再想想"
        onClose={() => {
          setShowDelModal(false)
        }}
        onCancel={() => {
          setShowDelModal(false)
        }}
        onConfirm={comfirmDel}
        className="rc_modal"
      />
    </View>
  )
}
export default PetItem
