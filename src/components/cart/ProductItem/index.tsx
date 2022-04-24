import { Radio, View, Image } from '@tarojs/components'
import { AtInputNumber, AtSwipeAction } from 'taro-ui'
import { formatMoney } from '@/utils/utils'
import { deleteCart } from '@/framework/api/cart/cart'
import Taro from '@tarojs/taro'
import './index.less'

const ProductItem = ({
  product,
  changeProduct,
  delCartSuccess,
}: {
  product: any
  changeProduct: Function
  delCartSuccess: Function
}) => {
  const { select, goodsNum, id } = product
  const { image, price, specs, tags } = product.localData

  const delCartProduct = async () => {
    console.log('333333')
    await deleteCart({ id, operator: '111' })
    delCartSuccess && delCartSuccess()
  }

  return (
    <View className="mt-2">
      <AtSwipeAction
        options={[
          {
            text: '删除',
            style: {
              backgroundColor: '#FF4949',
              width: '40px',
            },
          },
        ]}
        autoClose
        onClick={delCartProduct}
        areaWidth={Taro.getSystemInfoSync().windowWidth}
        maxDistance={70}
      >
        <View
          style={{
            width: Taro.getSystemInfoSync().windowWidth + 'px',
          }}
        >
          <View className="w-full flex flex-row items-center p-2">
            <Radio
              value="选中"
              checked={select}
              style={{ transform: 'scale(0.6)' }}
              color="red"
              className="text-48"
              onClick={() => changeProduct && changeProduct(id, 'select', !select)}
            />
            <Image
              className="w-20 h-20"
              src={image}
              onClick={() => {
                Taro.redirectTo({ url: `/pages/packageA/productDetail/index?id=${product.skuGoodInfo.id}` })
              }}
            />
            <View className="ml-2 w-full">
              <View className="font-semibold text-32 text-black">{product.skuGoodInfo.goodsName}</View>
              <View className="mt-1 font-semibold text-black">{specs}</View>
              <View className="flex flex-row mt-1 text-20">
                {tags.map((el) => (
                  <View className="border border-solid rounded-md border-red-500 mr-2 px-1 text-red-500">{el}</View>
                ))}
              </View>
              <View className="flex flex-row mt-1 justify-between items-center">
                <View className="text-red-500 font-medium text-base">{formatMoney(price)}</View>
                <View style={{ marginRight: '20px' }}>
                  <AtInputNumber
                    min={0}
                    max={10}
                    step={1}
                    value={goodsNum}
                    onChange={(value) => {
                      changeProduct && changeProduct(id, 'goodsNum', value)
                    }}
                    type="number"
                    className="rc-input-number"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </AtSwipeAction>
    </View>
  )
}
export default ProductItem
