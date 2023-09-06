// SPU接口
import request from '@/utils/request'
import type {
  SkuInfoData,
  SkuData,
  HasSpuResponseData,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SpuData,
} from './type'

enum API {
  // 获取已有SPU数据
  HASSPU_URL = '/admin/product/', //{page}/{limit}
  //   获取全部品牌信息
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  //spu全部售卖商品下的图片数据
  IMAGE_URL = '/admin/product/spuImageList/', //{spuId}
  //   spu下的全部已有的销售属性接口地址
  SPUHASSALEATTR_URL = '/admin/product/spuSaleAttrList/', //{spuId}
  //   获取整个项目全部的销售属性[颜色，版本，尺码]
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  //   追加一个新的SPU
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 更新已有的SPU
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  // 追加一个新增sku
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  // 查看已有的spu商品
  SKUINFO_URL = '/admin/product/findBySpuId/', //{spuId}
  // 删除已有的spu
  REMOVESPU_URL = '/admin/product/deleteSpu/', //{spuId}
}

// 三级分类下的spu数据
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: string | number,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )

//   品牌信息数据
export const reqAllTradeMark = () =>
  request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)

//spu全部售卖商品下的图片数据
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)

//   spu下的全部已有的销售属性接口地址
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPUHASSALEATTR_URL + spuId)

//   获取整个项目全部的销售属性[颜色，版本，尺码]
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)

// 追加一个新的SPU
// 更新已有的SPU
// data:新增的SPU或者是已有的SPU对象
export const reqAddOrUpdateSpu = (data: SpuData) => {
  // 如果spu对象有id,更新已有的spu
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}

// 添加sku
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)

// 获取SKU数据
export const reqSkuList = (spuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)

// 删除已有的SPU
export const reqRemoveSpu = (spuId: string | number) =>
  request.delete<any, any>(API.REMOVESPU_URL + spuId)
