import { CDNIMGURL } from '@/lib/constants'
import { Image, Text, View } from '@tarojs/components'
import { useEffect, useState } from 'react'

const ExpressLine = ({ expressList }: { expressList: any[] }) => {
  const [list, setList] = useState<any[]>([])

  useEffect(() => {
    const arr = expressList.length > 2 ? expressList.slice(0, 2) : expressList
    setList(arr)
  }, [expressList])

  return list.length ? (
    <View className="expressLine pt-0.5 pb-1">
      {list.map((express, key) => (
        <View className="marginTop" key={key}>
          <View className="flex items-center">
            <View className={`dian rounded-full mr-0.5 ${key === 0 && 'selectBackground'}`} />
            <View className={`title ${key === 0 && 'selectedWord'}`}>
              <Text>{express?.status}</Text> <Text>{express?.time}</Text>
            </View>
          </View>
          <View className={`flex line ${key !== expressList.length - 1 && 'selectLine'}`}>
            <View className="h-full mr-0.5">
              <View className="h-full m-auto" />
            </View>
            <View className="flex-1 break-all overflow-y-auto">{express?.context}</View>
          </View>
        </View>
      ))}
      {list.length <= 2 && (
        <View className="marginTop" key="no">
          <View className="flex items-center">
            <Image className="dian rounded-full mr-0.5" src={`${CDNIMGURL}logistics-more.png`} />
            <View
              className="title selectedWord}"
              onClick={(e) => {
                e.stopPropagation()
                setList(expressList)
              }}
            >
              <Text>查看详情</Text>
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
