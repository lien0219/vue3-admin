// 全部返回数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU返回数据类型
export interface SpuData {
  category3Id: string | number
  id?: number
  spuName: string
  tmId: number | string
  description: string
  spuImageList: null | SpuImg[]
  spuSaleAttrList: null | SaleAttr[]
}

export type Records = SpuData[]

// SPU接口数据返回类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 品牌数据类型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}

// 品牌接口返回的数据类型
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}

// 商品图片类型
export interface SpuImg {
  id?: number
  imgName?: string
  imgUrl?: string
  createTime?: string
  updateTime?: string
  spuId?: number
  name?: string
  url?: string
}
// 已有的spu照片墙数据类型
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

// 已有的销售属性值类型
export interface SaleAttrValue {
  baseSaleAttrId: number | string
  createTime?: null
  id?: number
  isChecked?: null
  saleAttrName?: string
  saleAttrValueName: string
  spuId?: number
  updateTime?: null
}
// 存储已有的销售属性值类型
export type spuSaleAttrValueList = SaleAttrValue[]

// 销售属性对象类型
export interface SaleAttr {
  baseSaleAttrId: number | string
  createTime?: null
  updateTime?: null
  id?: number
  saleAttrName: string
  spuId?: number
  spuSaleAttrValueList: spuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}
// spu已有的销售属性接口返回的数据类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// 已有的全部spu的返回数据类型
export interface HasSaleAttr {
  id: number
  name: string
}

export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}

export interface Attr {
  attrId: number | string //平台属性的id
  valueId: number | string //属性值的id
}
export interface saleArr {
  saleAttrId: number | string //属性id
  saleAttrValueId: number | string //属性值id
}
export interface SkuData {
  category3Id: string | number //三级分类id
  spuId: string | number //已有的spu的id
  tmId: string | number //spu品牌的id
  skuName: string //sku名字
  price: string | number //sku价格
  weight: string | number //sku重量
  skuDesc: string //sku描述

  skuAttrValueList?: Attr[] //平台属性收集
  skuSaleAttrValueList?: saleArr[] //销售属性
  skuDefaultImg: string //sku图片地址
}

// 获取sku数据接口类型
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
