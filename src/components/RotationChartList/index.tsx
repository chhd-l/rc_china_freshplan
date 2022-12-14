import { PetListItemProps } from '@/framework/types/consumer'
import { CDNIMGURL } from '@/lib/constants'
import { Image, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import './index.less'

const RotationChartList = ({
  list,
  onClickPetList,
  onClickPetAdd,
  onSelectPet,
  newOpen = true,
}: {
  list: PetListItemProps[]
  onClickPetList?: Function
  onClickPetAdd?: Function
  onSelectPet?: (pet: PetListItemProps) => void
  newOpen?: boolean
}) => {
  const [current, setCurrent] = useState(0)
  const [nextMargin, setNextMargin] = useState(0)
  const [previousMargin, setPreviousMargin] = useState(0)

  const handlePetList = () => {
    onClickPetList && onClickPetList()
  }

  const handleAddPet = () => {
    onClickPetAdd && onClickPetAdd()
  }

  const handleSelectPet = (idx: number) => {
    onSelectPet && onSelectPet(list[idx])
  }

  const returnPetdefaultImage = (petType: any) => {
    if (petType === 'CAT') return 'cat-default.png'
    else return 'dog-default.png'
  }

  useEffect(() => {
    const nw = (Taro.getSystemInfoSync().windowWidth / 7.5) * 1.73
    setNextMargin(nw)
    const pw = (Taro.getSystemInfoSync().windowWidth / 7.5) * 2.02
    setPreviousMargin(pw)
  }, [])

  console.log('fjdjfkdf:', list, current)
  return (
    <View className="Pets bg-white">
      <View className={`PetTitle flex items-center justify-between p-1 ${newOpen ? 'text-[28px]' : 'text-[34px]'}`}>
        我的宠物
        {!!list.length && (
          <Image
            onClick={handlePetList}
            style={{ width: '20px', height: '20px' }}
            src="https://dtcdata.oss-cn-shanghai.aliyuncs.com/asset/image/icon_edit_2.png"
          />
        )}
      </View>
      <View className="splitline ml-1" />
      <View className="box-border px-2">
        <View className="box-border overflow-hidden">
          <View className="w-full flex flex-col items-center mt-1 mb-2 overflow-hidden relative">
            {!!list.length && newOpen && (
              <View
                className="add-new-icon absolute w-2 h-2 m-auto right-0.1 top-2.5 z-10 bg-white flex items-center justify-center rounded-full"
                onClick={handleAddPet}
              >
                <Text
                  className="rcciconfont text-[#D49D28] rccicon-add"
                  style={{
                    fontSize: '0.3rem',
                  }}
                />
              </View>
            )}
            <Swiper
              className="w-full flex items-center overflow-hidden"
              circular={list.length > 2 ? true : false}
              nextMargin={nextMargin + 'px'}
              previousMargin={previousMargin + 'px'}
              current={current}
              onChange={(e) => {
                const index = e.detail.current === list.length ? 0 : e.detail.current
                setCurrent(index)
                handleSelectPet(index)
              }}
            >
              {list.length ? (
                list.map((pet, key) => (
                  <SwiperItem key={key}>
                    <View
                      style={{
                        width: '100px',
                        height: '100px',
                      }}
                      className="flex items-center justify-center relative"
                    >
                      <Image
                        style={{
                          width: current === key ? '80%' : '60%',
                          height: current === key ? '80%' : '60%',
                          boxShadow: '-0.5px 0.5px 10px -3px #999',
                        }}
                        className="rounded-full"
                        src={pet.image ? pet.image : `${CDNIMGURL}${returnPetdefaultImage(pet.type)}`}
                      />
                      {onSelectPet ? (
                        <Image src={current === key ? `${CDNIMGURL}selected-s.png` : `${CDNIMGURL}unselected.png`} className={`pet-check ${current === key ? 'active' : ''}`} />
                      ) : null}
                    </View>
                  </SwiperItem>
                ))
              ) : (
                <SwiperItem>
                  <View
                    style={{
                      width: '100px',
                      height: '100px',
                    }}
                    className="flex items-center justify-center"
                  >
                    <View
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddPet()
                      }}
                      style={{
                        backgroundImage: `url(${CDNIMGURL}add-pet.png)`,
                        width: '90%',
                        height: '90%',
                      }}
                      className="m-auto w-full h-full rounded-full bg-no-repeat bg-contain text-gray-300"
                    />
                  </View>
                </SwiperItem>
              )}
            </Swiper>
            {!!list.length && (
              <View className="PetInfo mt-1">
                <Text className="PetInfoOne petNameColor">{list[current].name}</Text>
                <Text
                  className={`mx-0.5 rcciconfont text-[#D49D28] ${
                    list[current].gender === 'MALE' ? 'rccicon-male' : 'rccicon-female'
                  }`}
                  style={{
                    fontSize: '0.18rem',
                  }}
                />
                <Text className="mr-0.5">{list[current].breed}</Text>
                <Text>{list[current]?.breedName}</Text>
                <Text>{list[current].age}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default RotationChartList
