import { Address } from '@/framework/types/consumer'

export interface OrderProductAttributeAndValue {
  attributeName: string
  attributeNameEn: string
  attributeValueName: string
  attributeValueNameEn: string
  relId: string
  attributeId: string
  attributeValueId: string
  productId: string
}

export interface OrderLineItem {
  id: string
  skuNo: string
  spuNo: string
  skuName: string
  spuName: string
  productSpecifications: string
  pic: string
  price: string
  num: string
  productAttributeAndValues: [OrderProductAttributeAndValue]
  feedingDays: number
  isGift?: boolean
}

export interface Payment {
  payWayCode: string
  payWayOrderID: string
  amount: string
  paymentStartTime: string
  paymentFinishTime: string
  lastModifiedBy: string
  paymentState: string
}

export interface OrderPrice {
  productPrice: number
  deliveryPrice: number
  totalPrice: number
  discountsPrice: number
  vipDiscountsPrice: number
}

export interface OrderState {
  orderType: string
  orderState: 'UNPAID' | 'TO_SHIP' | 'SHIPPED' | 'COMPLETED' | 'VOID'
  storeId: string
  lastModifiedAt: string
  lastModifiedBy: string
  createdAt: string
  createdBy: string
  orderSource: string
}

export interface Logs {
  id: string
  status: string
  createdAt: string
  createdBy: string
}

export interface Buyer {
  isMember: boolean
  consumerId: string
  consumerName: string
  consumerEmail: string
  consumerLevel: string
  nickName: string
  phone: string
}

export interface Order {
  _id?: string
  orderNumber?: string
  version?: string
  lineItem?: OrderLineItem[]
  shippingAddress: Address
  payment?: Payment
  isSubscription?: string
  subscriptionId?: string
  freshType?: string
  subscriptionNo?: string
  orderPrice: OrderPrice
  orderState?: OrderState
  invoice?: {
    invoiceStatus: any
  }
  logs?: Logs
  remark?: string
  buyer?: Buyer
  delivery: ShippingInfo
}

export interface ShippingInfo {
  shippingTime?: string
  expectedShippingDate?: string
  shippingCompany?: string
  shippingCompanyImg?: string
  trackingId?: string
  isReturn?: string
  status?: string
  deliveryItems?: DeliveryInfo[]
}

export interface DeliveryInfo {
  time: string
  context: string
  areaCode: string
  areaName: string
  status: string
}
