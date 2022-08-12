//库存模式
export enum InventoryMode {
  TrackOnly = "TrackOnly",
  ReserveOnOrder = "ReserveOnOrder",
  None = "None",
}
//税收模式
export enum TaxMode {
  Platform = "Platform",
  External = "External",
  ExternalAmount = "ExternalAmount",
  Disabled = "Disabled",
}
//购物车创建来源
export enum CartOrigin {
  Consumer = "Consumer",
  Merchant = "Merchant",
}

export type OrderState = {
  orderState: string
}

export enum PaymentState {
  "BalanceDue" = "BalanceDue",
  "Failed" = "Failed",
  "Pending" = "Pending",
  "CreditOwed" = "CreditOwed",
  "Paid" = "paid",
}

export enum ShipmentState {
  Shipped = "Shipped",
  Ready = "Ready",
  Pending = "Pending",
  Delayed = "Delayed",
  Partial = "Partial",
  Backorder = "Backorder",
}

export enum AttributeConstraint {
  None = "None",
  Unique = "Unique",
  CombinationUnique = "CombinationUnique",
  SameForAll = "SameForAll"
}
