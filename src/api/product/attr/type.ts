// 分类数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 分类类型
export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

// 返回数据类型
export interface CategoryResponseData extends ResponseData {
  data: CategoryObj[]
}

// 属性与属性值数据类型
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean
}
export type AttrValueList = AttrValue[]

export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValueList
}

export type AttrList = Attr[]

export interface AttrResponseData extends ResponseData {
  data: Attr[]
}
