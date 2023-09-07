export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SKU对象类型
export interface Attr {
  id?: number
  attrId: number | string //平台属性的id
  valueId: number | string //属性值的id
}
export interface saleArr {
  id?: number
  saleAttrId: number | string //属性id
  saleAttrValueId: number | string //属性值id
}
export interface SkuData {
  category3Id?: string | number //三级分类id
  spuId?: string | number //已有的spu的id
  tmId?: string | number //spu品牌的id
  skuName?: string //sku名字
  price?: string | number //sku价格
  weight?: string | number //sku重量
  skuDesc?: string //sku描述

  skuAttrValueList?: Attr[] //平台属性收集
  skuSaleAttrValueList?: saleArr[] //销售属性
  skuDefaultImg?: string //sku图片地址
  isSale?: number //控制商品上架|下架
  id?: number
}

// SKU接口返回数据类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// SKU商品详情
export interface SkuInfoData extends ResponseData {
  data: SkuData
}
