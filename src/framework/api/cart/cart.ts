import { normalizeCartData } from '@/framework/api/lib/normalize'
import { getProductBySkuId } from '@/framework/api/product/get-product'
import { dataSource } from '@/mock/cart'
import Mock from 'mockjs'
import { session } from '@/utils/global'
import ApiRoot, { baseSetting, isMock } from '../fetcher'

export const getCarts = async (isNeedReload = false) => {
  try {
    if (isMock) {
      return Mock.mock(dataSource)
    } else {
      let cartProducts = session.get('cart-data')
      if (!cartProducts || isNeedReload) {
        const res = await ApiRoot.carts().getCarts({ customerId: baseSetting.customerId, storeId: baseSetting.storeId })
        cartProducts = res?.carts || []
        console.log('cart data', cartProducts)
        for (let i = 0; i < cartProducts.length; i++) {
          let data = await getProductBySkuId({ goodsVariantId: cartProducts[i].goodsVariantID })
          cartProducts[i] = normalizeCartData(cartProducts[i], data.productBySkuId)
        }
        session.set('cart-data', cartProducts)
      }
      console.log('cart products data', cartProducts)
      return cartProducts||[]
    }
  } catch (err) {
    console.log('err', err)
    return []
  }
}
export const getCartNumber = async (isNeedReload=false) => {
  const carts = await getCarts(isNeedReload)
  const cartNumber = carts.reduce((prev, cur) => {
    return prev + cur.goodsNum
  }, 0)
  return cartNumber || 0
}

export const createCart = async (params: any) => {
  try {
    const cart = await ApiRoot.carts().createCart({
      body: params,
    })
    console.log('create cart view', cart)
    return cart
  } catch (e) {
    console.log(e)
    return []
  }
}

export const deleteCart = async ({ id, operator }: { id: string; operator: string }) => {
  try {
    const data = await ApiRoot.carts().deleteCart({
      body: { id, operator },
    })
    console.log('delete cart view', data)
    return data
  } catch (e) {
    console.log(e)
    return []
  }
}

export const updateCart = async ({ id, goodsNum, operator }: { id: string; goodsNum: number; operator: string }) => {
  try {
    const cart = await ApiRoot.carts().updateCart({
      body: {
        id,
        goodsNum,
        operator,
        storeId: baseSetting.storeId,
      },
    })
    console.log(cart)
    return cart
  } catch (e) {
    console.log(e)
    return []
  }
}
