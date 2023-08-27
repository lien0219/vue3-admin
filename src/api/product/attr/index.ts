// 属性管理api
import request from '@/utils/request'
import type { CategoryResponseData, AttrResponseData, Attr } from './type'

// 接口地址
enum API {
  // 一级分类
  C1_URL = '/admin/product/getCategory1',
  // 二级分类
  C2_URL = '/admin/product/getCategory2/', //category1Id
  // 三级分类
  C3_URL = '/admin/product/getCategory3/', //category2Id
  //   已有属性和属性值
  ATTR_URL = '/admin/product/attrInfoList/', //   {category1Id}/{category2Id}/{category3Id}
  //   添加或者修改属性
  ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
  //  删除
  DELETEATTR_URL = '/admin/product/deleteAttr/', //{attrId}
}

//一级分类接口
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)

// 二级分类接口
export const reqC2 = (category1Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C2_URL + category1Id)

// 三级分类接口
export const reqC3 = (category2Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C3_URL + category2Id)

//   已有属性和属性值的添加和修改
export const reqAttr = (
  category1Id: string | number,
  category2Id: string | number,
  category3Id: string | number,
) =>
  request.get<any, AttrResponseData>(
    API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`,
  )

//   新增与修改
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDORUPDATEATTR_URL, data)

//  删除
export const reqRemoveAttr = (attrId: number) =>
  request.delete<any, any>(API.DELETEATTR_URL + attrId)
