export type Address = {
  id?: string
  receiverName?: string
  phone: string
  province: string //省
  city: string //市
  detail: string
  postcode?: string
  isDefault?: boolean
  country?: string
  region: string //区
  consumerId?: string
  storeId?: string
}

export type Consumer = {
  id: string
  name: string
  avatarUrl: string
  nickName: string //昵称
  phone: string
  level: string
  points: number //积分情况，小程序会显示
  lastLoginTime?: string
  addresses: Address[]
  pets?: any[]
  orders?: any[]
  isCommunity?: boolean
}

export interface PetListItemProps {
  age: string
  id: string
  name: string
  type?: PetType
  gender?: PetGender
  code?: string
  breed: string
  isSterilized: boolean
  birthday: string
  image: string
  isOpened?: boolean
  consumerId?: string
  recentWeight?: string
  recentPosture?: PetPosture
  targetWeight?: string
  recentHealth?: string[]
}

export enum PetType {
  Dog = 'DOG',
  Cat = 'CAT',
}

export enum PetGender {
  Male = 'MALE',
  Female = 'FEMALE',
}

export enum Sterilized {
  No,
  Yes,
}

export enum PetPosture {
  Emaciated = 'EMACIATED',
  Thinner = 'THINNER',
  Standard = 'STANDARD',
  Fat = 'FAT',
  Obesity = 'OBESITY',
}

export enum PetHealth {
  PICKY_EATER = '1',
  FOOD_ALLERGIES_OR_STOMAC = '2',
  H_SENSITIVITIES = '3',
  DULL_OR_FLAKY_FUR = '4',
  ARTHRITIS_OR_JOINT_PAIN = '5',
  NONE = '0',
}

export enum PetStep {
  STEP1 = 13,
  STEP2 = 26,
  STEP3 = 41,
  STEP4 = 57,
  STEP5 = 72,
  STEP6 = 87,
}
