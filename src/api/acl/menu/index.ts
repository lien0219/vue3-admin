import request from '@/utils/request'
import type { PermisstionResponseData, MenuParams } from './type'

// 地址
enum API {
  // 全部菜单与按钮的标识数据
  ALLPERMISSTION_URL = '/admin/acl/permission',
  // 新增
  ADDMENU_URL = '/admin/acl/permission/save',
  // 编辑
  UPDATE_URL = '/admin/acl/permission/update',
  // 删除
  DELETEMENU_URL = '/admin/acl/permission/remove/', //{id}
}

export const reqAllPermisstion = () =>
  request.get<any, PermisstionResponseData>(API.ALLPERMISSTION_URL)

export const reqAddOrUpdateMenu = (data: MenuParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_URL, data)
  } else {
    return request.post<any, any>(API.ADDMENU_URL, data)
  }
}

export const reqRemoveMenu = (id: number) =>
  request.delete<any, any>(API.DELETEMENU_URL + id)
