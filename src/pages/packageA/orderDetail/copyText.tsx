import { Text, Image } from '@tarojs/components'
import { CDNIMGURL2 } from '@/lib/constants'
import Taro from '@tarojs/taro'

const CopyText = ({ str, type = false }: { str: string | undefined; type?: boolean }) => {
  return (
    <Text className={`text-[28px] flex items-center ${type ? 'justify-between' : 'justify-end'}  flex-1`}>
      {str}
      <Text
        className="text-[26px] w-[24px] h-[24px] text-[#96CC39] pl-0.5"
        onClick={(e) => {
          e.stopPropagation()
          Taro.setClipboardData({
            data: str || '',
          })
        }}
      >
        <Image src={`${CDNIMGURL2}copy-icon-s.png`} mode="widthFix" />
      </Text>
    </Text>
  )
}

export default CopyText
