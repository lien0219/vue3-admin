<template>
  <el-card style="height: 100px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请输入搜索用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="default"
          :disabled="keyword ? false : true"
          @click="search"
        >
          搜索
        </el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" @click="addUser">
      添加用户
    </el-button>
    <el-button
      type="primary"
      size="default"
      :disabled="selectIdArr.length ? false : true"
      @click="deleteSelectUser"
    >
      批量删除
    </el-button>
    <!-- table -->
    <el-table
      @selection-change="selectChange"
      style="margin: 10px 0px"
      border
      :data="userArr"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="用户名字"
        align="center"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column
        label="用户角色"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="260px" align="center">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setRole(row)"
          >
            分配角色
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateUser(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.username}吗？`"
            width="300px"
            @confirm="deleteUser(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器   @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9, 11]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total "
      :total="total"
      @current-change="getHasUser"
      @size-change="handler"
    />
  </el-card>
  <!-- 抽屉 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :inline="true" :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            placeholder="请你输入用户姓名"
            v-model="userParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            placeholder="请你输入用户昵称"
            v-model="userParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input
            placeholder="请你输入用户密码"
            v-model="userParams.password"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 职位分配抽屉 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色（职位）</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="userRole"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="(role, index) in allRole"
              :key="index"
              :label="role"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser,
} from '@/api/acl/user'
import type {
  UserResponseData,
  Records,
  User,
  AllRoleResponseData,
  AllRole,
  SetRoleData,
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let userArr = ref<Records>([])

// 表单实例
let formRef = ref<any>()

// 控制抽屉
let drawer = ref<boolean>(false)

// 用户信息
let userParams = reactive<any>({
  username: '',
  name: '',
  password: '',
})

// 角色分配抽屉
const drawer1 = ref<boolean>(false)
// 用户全部职位
let userRole = ref<AllRole>([])
// 已有职位
let allRole = ref<AllRole>([])

// 收集顶部复选框全选
const checkAll = ref<boolean>(false)
const isIndeterminate = ref<boolean>(true)
// 批量删除
let selectIdArr = ref<User[]>([])
// 搜索
let keyword = ref<string>('')
// setting仓库刷新state
let settingStore = useLayOutSettingStore()

onMounted(() => {
  getHasUser()
})
//获取全部的已有用户信息
const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}

// 分页器下拉
const handler = () => {
  getHasUser()
}

// 添加
const addUser = () => {
  drawer.value = true
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  // 清除上一次校验错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}

// 编辑
const updateUser = (row: User) => {
  drawer.value = true
  Object.assign(userParams, row)
  // 清除上一次校验错误提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}

// 保存
const save = async () => {
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateUser(userParams)
  if (result.code == 200) {
    drawer.value = false

    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    // getHasUser(userParams.id ? pageNo.value : 1)
    // 浏览器自动刷新
    window.location.reload()
  } else {
    drawer.value = false

    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
  }
}

// 取消
const cancel = () => {
  drawer.value = false
}

// 校验用户名字
const valiatorUsername = (rule: any, value: any, callBack: any) => {
  console.log(rule)

  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}
// 用户昵称
const valiatorname = (rule: any, value: any, callBack: any) => {
  console.log(rule)

  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}
// 用户密码
const valiatorPassword = (rule: any, value: any, callBack: any) => {
  console.log(rule)

  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}
// 表单校验
const rules = {
  username: [{ required: true, trigger: 'blur', validator: valiatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: valiatorname }],
  password: [{ required: true, trigger: 'blur', validator: valiatorPassword }],
}

// 分配角色
const setRole = async (row: User) => {
  // console.log(row)
  Object.assign(userParams, row)
  let result: AllRoleResponseData = await reqAllRole(userParams.id)
  // console.log(result)
  if (result.code == 200) {
    allRole.value = result.data.allRolesList
    userRole.value = result.data.assignRoles
    drawer1.value = true
  }
}
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: string[]) => {
  checkAll.value = value.length === allRole.value.length
  isIndeterminate.value = value.length !== allRole.value.length
}

// 分配职位
const confirmClick = async () => {
  let data: SetRoleData = {
    userId: userParams.id,
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
  }
  // console.log(data)
  let result: any = await reqSetUserRole(data)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配职位成功',
    })
    drawer1.value = false
    getHasUser(pageNo.value)
  } else {
    ElMessage({
      type: 'error',
      message: '分配职位失败',
    })
  }
}

// 删除某一个用户
const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

// table复选框勾选
const selectChange = (value: any) => {
  // console.log(value)
  selectIdArr.value = value
}
// 批量删除
const deleteSelectUser = async () => {
  //整理批量删除的参数
  let idsList: any = selectIdArr.value.map((item) => {
    return item.id
  })
  //批量删除的请求
  let result: any = await reqSelectUser(idsList)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

// 搜索
const search = () => {
  getHasUser()
  keyword.value = ''
}
// 重置
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
