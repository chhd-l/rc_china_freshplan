// import { ApiRoot } from "../../fetcher";
import { mockProduct } from '@/framework/mock/product'
import { products } from '@/framework/mock/products'
import { ProductDetailProps } from '@/framework/types/products'
import apis from '@/framework/config/api-config'
// import { ProductDetailProps } from '@/framework/types/products'
import ApiRoot from '../fetcher'
import { normalizeCatOrDogAttr, normalizeProductForFe, normalizeProductsforFe, normalizeForOrderCreate } from '../lib/normalize'

export const getProduct = async ({ storeId, productId }) => {
  try {
    // const { productGet: data } = mockProduct.data
    const { productGet: data } = await ApiRoot(({ url: apis.productDetail })).products().getProductBySpu({
      storeId,
      productId,
    })
    // console.info('listlistlistlist......', data)
    // let data = mockProduct.data.FindProductList.records[0]
    const detail = normalizeProductForFe(data)
    return detail
    // return detail.map((pet) => normalizeProductForFe(pet))
  } catch (err) {
    console.log(err, 'err')
  }
}

export const getProducts = async (params: any) => {
  // let list = mockProduct.data.FindProductList.records[0]
  try {
    const res = await ApiRoot({ url: apis.productList }).products().getESProductLists(params)
    let list = res?.productFindPageByEs?.records || []
    console.info('test', res)
    // const productList = normalizeProductsforFe(list)
    const productList = normalizeForOrderCreate(list)
    console.info('productList res', productList)
    return {
      productList,
      total: res?.productFindPageByEs?.total || 0
    }
  } catch (err) {
    console.info('err', err)
    return {
      productList: [],
      total: 0
    }
  }
}
export const getProductBySkuId = async ({ productVariantId }: { productVariantId: string }) => {
  try {
    const res = await ApiRoot({ url: apis?.sku_detail }).products().getProductBySku({
      productVariantId,
    })
    console.log('getProductBySkuId view', res)
    return res
  } catch (err) {
    console.log(err, 'err')
  }
}
export const getAttrs = async ({ storeId, categoryId }: { storeId: string; categoryId: string }) => {
  try {
    const res = await ApiRoot({ url: apis.product }).products().getAttrList({
      storeId,
      categoryId,
    })
    console.log('getProductBySkuId view', res)
    return normalizeCatOrDogAttr(res?.productAttributeFindByCategoryId || [], categoryId)
  } catch (err) {
    console.log(err, 'err')
  }
}

export const addSearchInfoRecordRecently = async (params) => {
  try {
    const res = await ApiRoot({ url: apis.productSearch }).products().searchInfoRecordRecently(params)
    return true
  } catch (err) {
    console.log(err, 'err')
    return false
  }
}


export const searchInfoRecordRecentlyDelete = async (params) => {
  try {
    const res = await ApiRoot({ url: apis.productSearch }).products().searchInfoRecordRecentlyDelete(params)
    return true
  } catch (err) {
    console.log(err, 'err')
    return false
  }
}

export const searchInfoRecordRecentlyFind = async (consumerId: string) => {
  try {
    const res = await ApiRoot({ url: apis.productSearch }).products().searchInfoRecordRecentlyFind(consumerId)
    return res
  } catch (err) {
    console.log(err, 'err')
    return []
  }
}

export const hotSearchFindPage = async (params: any) => {
  try {
    const res = await ApiRoot(({ url: apis.product })).products().hotSearchFindPage(params)
    if (!res.isVisibleOnShop) {
      return { total: 0, records: [] }
    }
    return res
  } catch (err) {
    console.log(err, 'err')
    return {
      total: 0,
      records: []
    }
  }
}

export const getProductInfoBySkuIds = async ({ skuIds }: { skuIds: string[] }) => {
  try {
    const res = await ApiRoot({ url: apis?.sku_detail }).products().getProductInfoBySkuIds(skuIds)
    console.log('getProductBySkuId view', res)
    return res
  } catch (err) {
    console.log(err, 'err')
  }
}
