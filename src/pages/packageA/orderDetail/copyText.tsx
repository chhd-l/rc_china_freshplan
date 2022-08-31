import { Text } from '@tarojs/components'
import Taro from '@tarojs/taro'

const CopyText = ({ str, type = false }: { str: string | undefined; type?: boolean }) => {
  return (
    <Text className={`text-[28px] flex items-center ${type ? 'justify-between' : 'justify-end'}  flex-1`}>
      {str}
      <Text
        className="text-[26px] text-[#96CC39] pl-0.5"
        onClick={(e) => {
          e.stopPropagation()
          Taro.setClipboardData({
            data: str || '',
          })
        }}
      >
        复制
      </Text>
    </Text>
  )
}

export default CopyText
