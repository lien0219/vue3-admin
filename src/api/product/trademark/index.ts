import request from '@/utils/request'
import type { TradeMarkResponseData, TradeMark } from './type'

// 品牌管理接口
enum API {
  // 已有品牌数据
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  //   添加品牌
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  //   修改品牌
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  DELETE_URL = '/admin/product/baseTrademark/remove/',
}

// {page}/{limit} 参数page,limit
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(
    API.TRADEMARK_URL + `${page}/${limit}`,
  )

// 添加与修改品牌
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
  //修改
  if (data.id) {
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    // 添加
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}

// 删除
export const reqDeleteTrademark = (id: number) =>
  request.delete<any, any>(API.DELETE_URL + id)
