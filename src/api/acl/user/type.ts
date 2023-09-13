// 账号信息类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 一个账号信息的ts类型
export interface User {
  id?: number
  createTime: string
  updateTime: string
  username?: string
  password?: string
  name?: string
  phone: null
  roleName: string
}

// 数组包含的全部用户信息
export type Records = User[]

// 全部用户信息返回的数据类型
export interface UserResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}

// 职位ts类型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark: null
}

// 全部职位列表
export type AllRole = RoleData[]

// 全部职位接口返回类型
export interface AllRoleResponseData extends ResponseData {
  data: {
    assignRoles: AllRole
    allRolesList: AllRole
  }
}

// 用户分配职位接口
export interface SetRoleData {
  roleIdList: number[]
  userId: number
}
