// import { breedListMock } from '@/mock/pet'
import BreedLists from '@/components/customer/BreedLists'
import { getBreedList } from '@/framework/api/pet/get-breeds'
import { pySegSort } from '@/utils/pinyin'
import { Image, View } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import cloneDeep from 'lodash.cloneDeep'
import { useState } from 'react'
import { AtSearchBar } from 'taro-ui'
// const breedLists = Mock.mock(breedListMock).list
// console.info('breedLists', breedLists)
export interface BreedListItemProps {
  id: string
  code: string
  name: string
  type: string
  isHot: boolean
  image: string
}
const BreedList = () => {
  const [breedList, setBreedList] = useState<BreedListItemProps[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [keyword, setKeyword] = useState<string>('')
  const [list, setList] = useState<any[]>([])
  const { router } = getCurrentInstance()
  const handleKeyword = (val) => {
    setKeyword(val)
  }

  Taro.useReady(() => {
    getList()
  })

  const getList = async () => {
    let res = await getBreedList()
    let type = !!router?.params?.type ? router?.params?.type : 'CAT'
    console.log('res', res)
    console.log('type', type)
    console.log('typ!!router?.params?.typee', !!router?.params.type, router?.params?.type)
    res = res.filter((el) => el.type == type)
    console.log('res', res)
    setBreedList(res)

    const lists = cloneDeep(res)
    initData(lists)
  }

  const handleBreed = ({ name, code }) => {
    const pages = Taro.getCurrentPages()
    const current = pages[pages.length - 1]
    const eventChannel = current.getOpenerEventChannel()
    eventChannel.emit('seachBreed', { breed: name, code })
    Taro.navigateBack()
  }
  const initData = (data: BreedListItemProps[]) => {
    let newList: any = pySegSort(data)
    setList(newList)
  }
  const handleSearch = () => {
    let lists = breedList.filter((item) => item.name.includes(keyword))
    initData(lists)
  }

  return (
    <>
      {breedList.length ? (
        <View className="bg-gray-200">
          <AtSearchBar
            className="bg-gray-200"
            showActionButton
            value={keyword}
            onChange={handleKeyword}
            onActionClick={handleSearch}
          />
          <View className="fixed text-24 top-16 right-2 z-10">
            {list.map((el) => (
              <View
                className="mt-2"
                onClick={() => {
                  setActiveId(`item-${el.letter}`)
                }}
              >
                {el.letter?.toUpperCase()}
              </View>
            ))}
          </View>
          <View className="px-4">
            <View className="text-30 py-3">热门品种</View>
            <View className="grid grid-cols-5 gap-6 px-4">
              {breedList
                .filter((el) => el.isHot)
                .filter((el, idx) => idx < 10)
                .map((breed) => (
                  <View
                    onClick={() => {
                      console.info('breedbreed', breed)
                      handleBreed(breed)
                    }}
                  >
                    <Image lazyLoad src={breed.image} className="w-full rounded-full  h-8" mode="widthFix" />
                    <View className="text-24 whitespace-nowrap overflow-hidden overflow-ellipsis">{breed.name}</View>
                  </View>
                ))}
            </View>
          </View>
          <View>
            <View className="px-4 text-30 pt-3">品种列表</View>
            <BreedLists activeId={activeId} list={list} handleBreed={handleBreed} />
          </View>
        </View>
      ) : null}
    </>
  )
}
export default BreedList
