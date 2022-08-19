// import { ProductVariants } from '@/framework/schema/products.schema'
import { SkuItemProps } from '@/framework/types/products'
import { dealDatasForApi, formatDateToApi } from '@/utils/utils'
import moment from 'moment'

export const normalizePetsForApi = (petInfo: any) => {
  let data: any = dealDatasForApi(petInfo, petItemApiArr, petItemFeArr)
  if (data.id === '-1') {
    //处理新增情况
    delete data.id
  }
  delete data.operator
  if (data.birthday) {
    //处理日期
    data.birthday = formatDateToApi(data.birthday)
  }
  if (data.recentHealth) {
    data.recentHealth = data.recentHealth.join('|')
  }
  if (data.recentWeight) {
    data.recentWeight = Number(data.recentWeight)
  }
  if (data.targetWeight) {
    data.targetWeight = Number(data.targetWeight)
  }
  if (data.subscriptionNo) {
    data.subscriptionNo = undefined
  }
  console.info('data', data)
  return data
}
export const normalizePetsForFe = (petInfo: any) => {
  let data: any = dealDatasForApi(petInfo, petItemFeArr, petItemApiArr)
  if (data.birthday) {
    data.birthday = moment(petInfo.birthday).format('YYYY-MM-DD')
  }
  if (data.recentHealth) {
    data.recentHealth = data.recentHealth.split('|');
  }
  if (data.recentWeight) {
    data.recentWeight = '' + data.recentWeight;
  }
  if (data.targetWeight) {
    data.targetWeight = '' + data.targetWeight;
  }
  return data
}

export const normalizeProductForFe = (product: any): any => {
  // product.attributeValueRelations?.forEach((attr) => {
  //   let tagStr = ''
  //   switch (attr.attributeName) {
  //     case '年龄':
  //       tagStr = `适用年龄:${attr.attributeValueName}` //显示中文
  //       break
  //     case '干/湿':
  //       let value =
  //         (attr.attributeValueName == '湿粮' && '每日一包') || (attr.attributeValueName == '其他' && '2日一罐')
  //       tagStr = value ? `建议干湿搭配:${value}` : ''
  //       break
  //   }
  //   tags.push(tagStr)
  // })
  // 单独处理一个规格的情况，下架商品不可见
  let { specifications, variants } = product
  if (specifications?.length === 1) {
    let productSpecificationDetailIdArr = variants?.map(
      (el) => el.specificationRelations?.[0]?.specificationDetailId,
    )
    console.info('productSpecificationDetailIdArr', productSpecificationDetailIdArr)
    specifications[0].specificationDetails = specifications[0]?.specificationDetails?.filter((el) =>
      productSpecificationDetailIdArr.find((cel) => el?.id === cel),
    )
    console.info('specifications', specifications)
  }
  if (specifications?.length > 1) {
    //多个规格的情况，需要处理无库存的时候置灰
    variants = variants?.filter(el => el.stock)
  }
  let spu = {
    // specs: string
    name: product.name,
    // stock: number
    // price: product.mar
    // originalPrice:
    id: product.id,
    wxCodeUrl: product.wxCodeUrl,
    no: product.spuNo,
    tags: [''], //逻辑处理
    img: product.asserts?.filter((el) => el.type === 'image')?.map((el) => el.artworkUrl),
    video: product.asserts?.filter((el) => el.type === 'video')?.[0]?.artworkUrl,
    skus: variants
      ?.map((sku, index) => normalizeSkuForFe(sku, index, product.attributeValueRelations, specifications)),
    type: product.type,
    description: product.description,
    specifications:
      specifications
        ?.map((spec) => {
          let item = {
            id: spec.id,
            name: spec.specificationName,
            children: spec.specificationDetails?.map((el) => {
              return {
                able: true,
                id: el.id,
                name: el.specificationDetailName,
              }
            }),
          }
          return item
        })
        .filter((el) => el.children?.length) || [], //可能存在没规格的页面
  }
  return spu
}

export const normalizeSkuForFe = (
  sku: any,
  index: number,
  attributeValueRelations: any,
  specifications,
): SkuItemProps => {
  let tags: string[] = normalizeTags(attributeValueRelations, sku.feedingDays)
  // let tags = sku.feedingDays ? [...spuTags, `建议饲喂天数:${sku.feedingDays}天`] : [...spuTags]
  let item = {
    // specs: string
    name: sku.name,
    stock: sku.stock,
    price: sku.marketingPrice,
    originalPrice: sku.listPrice,
    id: sku.id,
    feedingDays: sku.feedingDays,
    no: sku.skuNo,
    tags: tags?.filter((el) => el), //筛选有数据的展示
    img: [sku.defaultImage],
    specString: '',
    productSpecificationRel: sku.specificationRelations,
    specText: normalizeSpecText(sku.specificationRelations, specifications)?.filter((el) => el),
    specIds:
      sku.specificationRelations?.map((el) => {
        return el.specificationDetailId
      }) || [],
    defaultChoose: index === 0 ? true : false,
  }
  return item
}
export const normalizeProductsforFe = (data: any) => {
  let list = data?.map((item) => {
    console.log('item-------------', item)
    let minItem = item.variants ? item.variants[0] : null
    let images = item.asserts?.filter((el) => el.type === 'image')
    // item.variants.forEach((variant) => {
    //   if (variant?.marketingPrice && Number(minItem.marketingPrice) > Number(variant?.marketingPrice)) {
    //     minItem = variant
    //   }
    // })
    return {
      name: item.name,
      img: minItem?.defaultImage || (images ? images[0]?.artworkUrl : null),
      originalPrice: minItem?.listPrice,
      price: minItem?.marketingPrice,
      sku: minItem?.id,
      spu: item.id,
      description: item?.description,
    }
  })
  return list
}

export const normalizeForOrderCreate = (data: any[]) => {
  return (data ?? []).map((item: any) => {
    item.variants = Object.assign({}, (item?.variants?.[0] ?? {}), { num: 1 });
    return item;
  });
}

export const normalizeSpecText = (specificationRelations, specifications): string[] => {
  return specificationRelations?.map((el) => {
    let specObj = specifications.find((spec) => spec.id === el.specificationId)
    let specDetailName = specObj?.specificationDetails?.find(
      (specDetail) => specDetail.id === el.specificationDetailId,
    )?.specificationDetailName
    // console.info('productSpecificationDetailId', specDetailName)
    return specDetailName || ''
  })
}

const petItemApiArr = [
  'name',
  'gender',
  'type',
  'breedCode',
  'breedName',
  'image',
  'isSterilized',
  'birthday',
  'consumerId',
  'operator',
  'id',
  'recentWeight',
  'targetWeight',
  'recentPosture',
  'recentHealth',
  'subscriptionNo',
]
const petItemFeArr = [
  'name',
  'gender',
  'type',
  'code',
  'breed',
  'image',
  'isSterilized',
  'birthday',
  'consumerId',
  'operator',
  'id',
  'recentWeight',
  'targetWeight',
  'recentPosture',
  'recentHealth',
  'subscriptionNo',
]

export const normalizeCartData = (cart: any, productSkuInfo: any, isSubscription?: boolean) => {
  let spuimage = productSkuInfo.asserts?.[0]?.artworkUrl || productSkuInfo.defaultImage
  productSkuInfo.variants = productSkuInfo?.productVariant || productSkuInfo?.variants
  const productSku = { ...productSkuInfo }
  if (spuimage) {
    productSku.defaultImage = spuimage
  }
  delete productSku.asserts
  cart.skuGoodInfo = productSku
  cart.select = false
  cart.localData = {
    name: productSkuInfo?.variants[0]?.name || productSkuInfo.productName || productSkuInfo.name,
    image: productSkuInfo?.variants[0]?.defaultImage || spuimage,
    price: isSubscription ? productSkuInfo?.variants[0]?.subscriptionPrice : productSkuInfo?.variants[0]?.marketingPrice,
    tags: normalizeProductForFe(productSkuInfo)?.skus[0].tags,
    specs: normalizeProductForFe(productSkuInfo)?.skus[0].specText,
    stock: productSkuInfo?.variants[0]?.stock || 0,//sku库存
    shelvesStatus: productSkuInfo?.variants[0]?.shelvesStatus || false,//sku上下架状态
    isDeleted: productSkuInfo?.variants[0]?.isDeleted || false//sku是否被删除
  }
  return cart
}

export const normalizeTags = (attributeValueRels, feedingDays) => {
  let tags: string[] = []
  attributeValueRels?.forEach((attr) => {
    switch (attr.attributeName) {
      case '年龄':
        tags[0] = `适用年龄: ${attr.attributeValueName}` //显示中文
        break
      case '干/湿':
        let value =
          (attr.attributeValueName == '湿粮' && '每日一包') ||
          (attr.attributeValueName == '其他' && '2日一罐')
        let dryVal = attr.attributeValueName == '干粮' && feedingDays && `建议饲喂天数: ${feedingDays}天`

        tags[1] = value ? `建议干湿搭配: ${value}` : ''
        tags[2] = dryVal || ''
        break
    }
  })
  let tagsArr = tags?.filter((el) => el)
  return tagsArr
}

export const normalizeCatOrDogAttr = (atrrs, categoryId) => {
  let keyLable = ['专区', '年龄', '功能', '品种']
  // if (categoryId == '8') {
  //   //狗的时候，年龄展示lifestage
  //   let keyLable = ['专区', '年龄', '功能', '品种']
  // }
  let newArr: any = []
  keyLable.forEach((el) => {
    atrrs.find((item) => {
      let data = {
        key: item.attributeNameEn,
        label: item.attributeName,
        list: item.values?.map((cel: any) => {
          return {
            categoryId,
            attributeId: cel.attributeId,
            value: cel.id,
            label: cel.attributeValueName,
          }
        }),
      }
      if (el === item.attributeName) {
        newArr.push(data)
      }
    })
  })
  return newArr
}
