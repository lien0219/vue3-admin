// SKU
import request from '@/utils/request'
import type { SkuResponseData, SkuInfoData } from './type'

enum API {
  // 获取已有的商品数据-SKU
  SKU_URL = '/admin/product/list/', //{page}/{limit}
  // 上架
  SALE_URL = '/admin/product/cancelSale/', //{skuId}
  // 下架
  CANCELSALE_URL = '/admin/product/onSale/', //{skuId}
  // 商品详情
  SKUINFO_URL = '/admin/product/getSkuInfo/', //{skuId}
  //   删除
  DELETESKU_URL = '/admin/product/deleteSku/', //{skuId}
}

// 商品SKU列表
export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)

// 上架
export const reqSaleSku = (skuId: number) =>
  request.get<any, any>(API.SALE_URL + skuId)

//  下架
export const reqCancelSale = (skuId: number) =>
  request.get<any, any>(API.CANCELSALE_URL + skuId)

//   商品详情
export const reqSkuInfo = (skuId: number) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)

//   删除
export const reqRemoveSku = (skuId: number) =>
  request.get<any, any>(API.DELETESKU_URL + skuId)
