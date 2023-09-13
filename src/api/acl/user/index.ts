import request from '@/utils/request'
import type {
  UserResponseData,
  User,
  AllRoleResponseData,
  SetRoleData,
} from './type'

// 地址
enum API {
  // 用户账号信息
  ALLUSER_URL = '/admin/acl/user/', //{page}/{limit}
  // 添加用户
  ADDUSER_URL = '/admin/acl/user/save',
  // 更新用户
  UPDATEUSER_URL = '/admin/acl/user/update',
  // 获取全部职位
  ALLROLEURL_URL = '/admin/acl/user/toAssign/', //{adminId}
  // 根据用户分配角色
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  //删除某一个账号
  DELETEUSER_URL = '/admin/acl/user/remove/', //{id}
  // 批量删除
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove',
}

export const reqUserInfo = (page: number, limit: number, username: string) =>
  request.get<any, UserResponseData>(
    API.ALLUSER_URL + `${page}/${limit}/?username=${username}`,
  )

export const reqAddOrUpdateUser = (data: User) => {
  // 有id更新
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

export const reqAllRole = (userId: number) =>
  request<any, AllRoleResponseData>(API.ALLROLEURL_URL + userId)

export const reqSetUserRole = (data: SetRoleData) =>
  request.post<any, any>(API.SETROLE_URL, data)

export const reqRemoveUser = (userId: number) =>
  request.delete<any, any>(API.DELETEUSER_URL + userId)

export const reqSelectUser = (idList: number[]) =>
  request.delete<any, any>(API.DELETEALLUSER_URL, { data: idList })
