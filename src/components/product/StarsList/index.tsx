import { View, Image, ScrollView, Video } from '@tarojs/components'

interface StarsListProps {
  list: any
}
const StarsList = ({ list }: StarsListProps) => {
  return (
    <ScrollView className="whitespace-nowrap pl-2 bg-gray-100" scrollX>
      {list.map((product, idx) => (
        <View key={idx} className="inline-block mr-4" style="width:76%">
          <View className="flex items-center rounded-b-xl bg-white flex-col">
            {/* <Image
              style="width:100%"
              lazyLoad
              mode="widthFix"
              src="https://miniapp-product.royalcanin.com.cn/rcmini2020/upload/1613794160492_Id2TmT.png"
            /> */}
            <Video
              id="video"
              className="w-full border-0 h-64"
              src={product.mp4}
              poster={product.expr}
              object-fit="fill"
              autoplay={false}
              loop={false}
              muted={false}
            />
            <View className="flex w-full">
              {/* <View>
                <Image
                  lazyLoad
                  className="w-32 h-32"
                  src="https://miniapp-product.royalcanin.com.cn/rcmini2020/upload/1613794160492_Id2TmT.png"
                />
              </View>
              <View className="ml-4 h-full flex flex-col justify-center">
                <View className="text-xl">室内成猫专属</View>
                <View style={{ fontSize: '.75rem' }} className="mb-2">
                  室内成猫全粮价2kg/袋
                </View>
                <View className="text-xs">高易消化蛋白</View>
                <View className="text-xs">减少粪便量和异味</View>
                <View className="text-center mt-2 text-red-600">¥140</View>
              </View> */}
              <Image style="width:100%" lazyLoad mode="widthFix" src={product.img} />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  )
}

export default StarsList
