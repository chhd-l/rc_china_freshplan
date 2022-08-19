import { View, Image, Button } from '@tarojs/components'
import { AtIcon, AtModal, AtModalAction, AtModalContent, AtSwipeAction } from 'taro-ui'
import { UPLOADURL, CDNIMGURL, CDNIMGURL2 } from '@/lib/constants'
import Taro from '@tarojs/taro'
import cloneDeep from 'lodash.cloneDeep'
import { useEffect, useState } from 'react'
import EditPet from '@/components/consumer/EditPet'
import { editPetButton } from '@/lib/consumer'
import { deletePet } from '@/framework/api/pet/delete-pet'
import { PetListItemProps, PetType } from '@/framework/types/consumer'
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
const PetItem = ({ pet, petIdx, petList, setPetList, showAddPetBtn, getList }: Props) => {
  const [editActive, setEditActive] = useState<number>(-1)
  const [showDelModal, setShowDelModal] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)

  useEffect(() => {
    //add 的时候编辑启用
    console.log('pet', pet)
    !showAddPetBtn && petIdx === petList.length - 1 && setIsEdit(true)
  }, [showAddPetBtn, isEdit])

  const handleClick = (option, idx) => {
    if (option.text == '编辑') {
      // setIsEdit(true)
      Taro.navigateTo({
        url: '/pages/packageA/petDetail/index',
        success: (res) => {
          res.eventChannel.emit('petFromList', pet);
        }
      });
    } else if (option.text === '删除') {
      setShowDelModal(true)
    }
    setEditActive(idx)
  }

  const comfirmDel = async () => {
    let { id } = petList[editActive]
    const res = await deletePet({ id })
    setShowDelModal(false)
    if (res) {
      getList()
    } else {
      Taro.showToast({ title: '删除失败' });
    }
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
          isOpened={pet.isOpened}
          options={editPetButton}
          maxDistance={120}
          areaWidth={my.getSystemInfoSync().windowWidth * 0.9}
        >
          <View
            className="text-center w-screen bg-white bg-cover bg-no-repeat"
            style={{ padding: '30px 0' }}
            onClick={() => {
              showEdit(petIdx)
            }}
          >
            <View
              className={`w-6 ${
                pet.image ? ' bg-white   image-pad shadow-little' : ''
              } h-6 rounded-full flex items-center justify-center m-auto `}
            >
              <Image
                src={pet.image || `${CDNIMGURL}${pet.type === PetType.Cat ? 'cat-default.png' : 'dog-default.png'}`}
                // style={{ borderRadius: '50%' }}
                className="w-full h-full m-auto Petpictureshadow rounded-full"
              />
            </View>
            <View className="flex justify-center items-end pt-1">
              <View className="text-28 pr-1 font-medium" style={{color:'#D49D28'}}>{pet.name}</View>
              <View className="text-22" style={{color:'#999999'}}>
                {pet.breed}{pet.age}
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
