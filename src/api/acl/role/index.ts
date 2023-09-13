// 角色管理
import request from '@/utils/request'
import type { RoleResponseData, RoleData, MenuResponseData } from './type'

enum API {
  // 全部职位
  ALLROLE_URL = '/admin/acl/role/', //{page}/{limit}
  //  新增职位
  ADDROLE_URL = '/admin/acl/role/save',
  //  更新已有职位
  UPDATEROLE_URL = '/admin/acl/role/update',
  //  获取全部的菜单与按钮的数据
  AllPERMISSTION_URL = '/admin/acl/permission/toAssign/', //{roleId}
  //  给相应职位分配权限
  SETPERMISTION_URL = '/admin/acl/permission/doAssign/?',
  //   删除已有的职位
  REMOVEROLE_URL = '/admin/acl/role/remove/', //{id}
}

export const reqAllRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(
    API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`,
  )

export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}

export const reqAllMenuList = (roleId: number) =>
  request.get<any, MenuResponseData>(API.AllPERMISSTION_URL + roleId)

export const reqSetPermisstion = (roleId: number, permissionId: number[]) =>
  request.post<any, any>(
    API.SETPERMISTION_URL + `roleId=${roleId}&permissionId=${permissionId}`,
  )

export const reqRemoveRole = (roleId: number) =>
  request.delete<any, any>(API.REMOVEROLE_URL + roleId)
