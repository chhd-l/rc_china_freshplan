
import { IconNames } from '@/components/iconfont'
import { Image } from './common'
import { Scalars } from '../schema/common.schema'

export interface ProductBaseProps {
  // specs: string
  name: string
  id: string
  no: string
  tags: string[]
  img: string[] /*  */
  video?: string
}

export interface SpecIdProps {
  [x: string]: string
}
export interface SpecDetail {
  id: string
  name: string
  able: boolean
}

export interface SkuItemProps extends ProductBaseProps {
  defaultChoose: boolean
  stock: number
  price: number
  specIds: string[]
  specText: string[]
  originalPrice: number
  productSpecificationRel: any
}
export interface SpecProps {
  id: string
  name: string
  children: SpecDetail[]
}

export interface ProductDetailProps extends ProductBaseProps {
  skus: SkuItemProps[]
  wxCodeUrl: string
  type: string
  // productAttributeValueRel:attrProps[]
  description: string
  specifications: SpecProps[]
}

export enum FloorType {
  Activity,
  Stars,
  Dry,
  Wet,
}

export interface SwiperProps {
  url: string
  img: string
}

export interface FloorListProps {
  title: string
  label: string
  subTitle: string
  icon: IconNames
  type: FloorType
  active: boolean
  id: string
}
export interface ProductListItemProps {
  name: string
  img: string
  originalPrice: string
  price: string
  sku: string
  spu: string
}
export interface FilterListItemProps {
  key: string
  label: string
  list: (OptionProps & { active?: boolean; attributeId: string; categoryId: string; activeColor?: boolean })[]
}
export enum PetType {
  Dog,
  Cat,
}

export interface OptionProps {
  label: string
  value: string
}

export type Product = {
  id: string
  // key: string
  // version: number
  // createdAt: Scalars["DateTime"]
  // createdBy: Scalars["DateTime"]
  // lastModifiedAt: Scalars["DateTime"]
  // lastModifiedBy: Scalars["DateTime"]
  // productType: ProductKeyReference
  masterData: ProductCatalogData
  // taxCategory:TaxCategoryKeyReference
}

export type ProductType = {
  id: string
  key: string
  version: number
  createdAt: Scalars['DateTime']
  createdBy: Scalars['DateTime']
  lastModifiedAt: Scalars['DateTime']
  lastModifiedBy: Scalars['DateTime']
  name: string
  description: string
  attributes: AttributeDefinition[]
}

export type AttributeDefinition = {
  type: string
  name: string
  label: Scalars['LocalizedString']
  // isRequired: boolean
  // attributeConstraint: AttributeConstraint
  // inputTip: Scalars["LocalizedString"]
  // inputHint
  // isSearchable: boolean
}

export type ProductCatalogData = {
  // published: boolean
  // Whether the product is published.
  current: ProductData
  // The current data of the product.
  // staged: ProductData
  // The staged data of the product.
  // hasStagedChanges: boolean
  // Whether the staged data is different from the current data.
}
export type ProductData = {
  name: Scalars['LocalizedString']
  categories
  // References to categories the product is in.
  // categoryOrderHints?
  // description?: Scalars["LocalizedString"]
  // slug: Scalars["LocalizedString"]
  // Human-readable identifiers usually used as deep-link URL to the related product. Each slug is unique across a project, but a product can have the same slug for different languages.
  // For good performance, indexes are provided for the first 15 languages set on the Project.
  metaTitle?: Scalars['LocalizedString']
  metaDescription?: Scalars['LocalizedString']
  metaKeywords?: Scalars['LocalizedString']
  masterVariant: ProductVariant
  variants: ProductVariant[]
  // searchKeywords: SearchKeywords
}
export type ProductVariant = {
  id: number
  sku?: string
  attributes?: Attribute[]
  price?: string
  images?: Image[]
  availability?: ProductVariantAvailability
  isMatchingVariant?: boolean
}
export type ProductVariantAvailability = {
  isOnStock?: boolean
  availableQuantity?: number
}
export type Attribute = {
  name
  value: AttributeDefinition
}
export type SearchKeywords = {
  [key: string]: SearchKeyword[]
}
export type SearchKeyword = {
  /**
   *
   */
  text: string
  /**
   *	The tokenizer defines the tokens that are used to match against the [Suggest Query](/../products-suggestions#suggest-query) input.
   *
   */
  suggestTokenizer?: SuggestTokenizer
}
/**
 *	The tokenizer defines the tokens that are used to match against the [Suggest Query](/../products-suggestions#suggest-query) input.
 *
 */
export declare type SuggestTokenizer = CustomTokenizer | WhitespaceTokenizer
export type CustomTokenizer = {
  type: 'custom'
  /**
   *
   */
  inputs: string[]
}
export type WhitespaceTokenizer = {
  type: 'whitespace'
}
