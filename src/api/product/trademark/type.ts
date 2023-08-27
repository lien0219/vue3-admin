export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 已有品牌的数据类型
export interface TradeMark {
  id?: number
  tmName: string
  logoUrl: string
}

// 全部品牌数据接口类型
export type Records = TradeMark[]

// 已有全部品牌的数据类型
export interface TradeMarkResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
