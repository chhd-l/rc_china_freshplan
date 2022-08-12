import { Text } from '@tarojs/components'
import Taro from '@tarojs/taro'

const CopyText = ({ str }: { str: string | undefined }) => {
  return (
    <Text className="flex items-center">
      {str}
      <Text
        className="copyText px-0.5"
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
