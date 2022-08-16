import { CDNIMGURL, CDNIMGURL2 } from '@/lib/constants'
import { Image, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { PetListItemProps, PetGender } from '@/framework/types/consumer';
import './index.less'

const RotationChartList = ({ type = 'pet', list }: { type?: string; list: PetListItemProps[] }) => {
  const [current, setCurrent] = useState(list.length > 1 ? 1 : 0)
  const [nextMargin, setNextMargin] = useState(0)
  const [previousMargin, setPreviousMargin] = useState(0)

  const handlePetList = () => {
    my.navigateTo({ url: '/pages/petList/index' })
  }

  const handleAddPet = () => {
    my.navigateTo({ url: '/pages/petEdit/index' })
  }

  // const returnPetdefaultImage = (petType: 'dog' | 'cat') => {
  //   if(petType === 'dog') return 'cat-default.png'
  //   else return 'dog-default.png'
  // }

  useEffect(() => {
    const nw = (Taro.getSystemInfoSync().windowWidth / 7.5) * 1.73
    setNextMargin(nw)
    const pw = (Taro.getSystemInfoSync().windowWidth / 7.5) * 2.02
    setPreviousMargin(pw)
  }, [])

  return (
    <View className="Pets bg-white my-1">
      <View className="PetTitle flex items-center justify-between p-1">
        {type === 'plan' ? 'Fresh Plan' : '我的宠物'}
        {!!list.length && (
          <Image onClick={handlePetList} style={{ width: '20px', height: '20px' }} src={`${CDNIMGURL}pet_edit.png`} />
        )}
      </View>
      <View className="splitline ml-1" />
      <View className="box-border px-2">
        <View className="box-border overflow-hidden">
          <View className="w-full flex flex-col items-center mt-1 mb-2 overflow-hidden relative">
            {type === 'pet' && !!list.length && (
              <View className="absolute w-2 h-2 m-auto right-0 top-2.5 z-10" onClick={handleAddPet}>
                <View
                  className="bg-no-repeat bg-contain w-full h-full rounded-full bg-white"
                  style={{
                    backgroundImage: `url(${CDNIMGURL}small_add.svg)`,
                    boxShadow: '0px 0 8px 2px #eaeaea',
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
              }}
            >
              {list.length ? (
                list.map((_, key) => (
                  <SwiperItem key={key}>
                    <View
                      style={{
                        width: '100px',
                        height: '100px',
                      }}
                      className="flex items-center justify-center"
                    >
                      <Image
                        style={{
                          width: current === key ? '80%' : '60%',
                          height: current === key ? '80%' : '60%',
                          boxShadow: '-0.5px 0.5px 10px -3px #999',
                        }}
                        className="rounded-full"
                        src={_.image || `${CDNIMGURL2}default-head.png`}
                      />
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
                        boxShadow: '-0.5px 0.5px 10px -3px #999',
                      }}
                      className="m-auto w-full h-full rounded-full bg-no-repeat bg-contain text-gray-300"
                    />
                  </View>
                </SwiperItem>
              )}
            </Swiper>
            {!!list.length && (
              <View className="PetInfo mt-1">
                <Text className={`PetInfoOne petNameColor ${type === 'plan' ? '' : 'mr-1'}`}>{list[current]['name']}</Text>
                <Text className={`${type === 'plan' ? 'petNameColor' : 'mr-0.5'}`}>
                  {type === 'plan' ? '的' : <Text className={`rcciconfont text-22 ${list[current]['gender'] === PetGender.Female ? 'rccicon-female text-color-primary' : 'rccicon-male text-gray-400'}`} />}
                </Text>
                <Text className={`${type === 'plan' ? 'petNameColor' : ''}`}>
                  {type === 'plan' ? 'Fresh Plan' : `${list[current]['breed']}${list[current]['age']}`}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default RotationChartList
