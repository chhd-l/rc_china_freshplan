// import { breedListMock } from '@/mock/pet'
import BreedLists from '@/components/consumer/BreedLists'
import { getBreedList } from '@/framework/api/pet/get-breeds'
import { pySegSort } from '@/utils/pinyin'
import { Image, View } from '@tarojs/components'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import cloneDeep from 'lodash.cloneDeep'
import { useState } from 'react'
import { AtSearchBar } from 'taro-ui'
import './index.less'
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
    let res: any;
    let breedListInStorage: any = my.getStorageSync({ key: 'breedList' });
    if (!breedListInStorage.error && breedListInStorage.data) {
      res = breedListInStorage.data;
    } else {
      res = await getBreedList()
    }
    let type = !!router?.params?.type ? router?.params?.type : 'CAT'
    res = res.filter((el) => el.type == type)
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
        <View className="breedlist" style={{ backgroundColor: '#eee' }}>
          <AtSearchBar
            className="bg-white petsSearchBtn"
            showActionButton
            value={keyword}
            onChange={handleKeyword}
            onActionClick={handleSearch}
          />
          <View className="fixed text-24 top-4 right-1 z-10">
            {list.map((el) => (
              <View
                className="mt-1"
                onClick={() => {
                  setActiveId(`item-${el.letter}`)
                }}
              >
                {el.letter?.toUpperCase()}
              </View>
            ))}
          </View>
          <View>
            <BreedLists activeId={activeId} list={list} handleBreed={handleBreed} />
          </View>
        </View>
      ) : null}
    </>
  )
}
export default BreedList
