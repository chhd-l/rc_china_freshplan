import { CDNIMGURL } from '@/lib/constants'
import { Image, Text, View } from '@tarojs/components'
import { useEffect, useState } from 'react'

const ExpressLine = ({ 
  expressList, 
  showMore, 
  showAll,
  onClickShowMore,
}: { 
  expressList: any[]
  showMore: boolean
  showAll: boolean
  onClickShowMore?: Function
}) => {
  const [list, setList] = useState<any[]>([])

  useEffect(() => {
    const arr = expressList.length > 2 ? expressList.slice(0, 2) : expressList
    setList(arr)
  }, [expressList])

  return list.length ? (
    <View className="expressLine pt-1 pb-[40px] pl-[0.125rem]">
      {(showAll ? expressList : expressList.slice(0, 2)).map((express, key) => (
        <View className="" key={key}>
          <View className="flex items-center">
            <View className={`dian rounded-full mr-1 ${key === 0 && 'selectBackground'}`} />
            <View className="flex items-end">
              <Text className={`${key === 0 && 'text-black'} text-[26px] font-bold leading-30px mr-0.5`}>{express?.status}</Text>{' '}
              <Text className="text-[22px] leading-[26px]">{express?.time}</Text>
            </View>
          </View>
          <View className={`flex line ${key !== expressList.length - 1 && 'selectLine'}`}>
            <View className="h-full mr-1">
              <View className="h-full m-auto" />
            </View>
            <View className="mb-1 text-[24px] leading-[28px] flex-1 break-all">{express?.context}</View>
          </View>
        </View>
      ))}
      {showMore && (
        <View className="marginTop" key="no">
          <View className="flex items-center">
            <Image className="dian rounded-full mr-1" src={`${CDNIMGURL}logistics-more.png`} />
            <View
              className="title selectedWord text-[26px]"
              onClick={(e) => {
                e.stopPropagation()
                onClickShowMore && onClickShowMore()
              }}
            >
              <Text className="text-color-primary">查看详情 <Text className="rcciconfont rccicon-right text-22" /></Text>
            </View>
          </View>
          <View className="flex line">
            <View className="h-full mr-0.5">
              <View className="h-full m-auto" />
            </View>
            <View className="flex-1 overflow-hidden" />
          </View>
        </View>
      )}
    </View>
  ) : null
}

export default ExpressLine
