<template>
  <el-card style="height: 100px">
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input
          placeholder="请你输入搜索职位关键字"
          v-model="keyword"
        ></el-input>
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
    <el-button type="primary" size="default" icon="Plus" @click="addRole">
      添加职位
    </el-button>
    <el-table border style="margin: 15px 0px" :data="allRole">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="职位名称"
        align="center"
        show-overflow-tooltip
        prop="roleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        show-overflow-tooltip
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        show-overflow-tooltip
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setPermisstion(row)"
          >
            分配权限
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateRole(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.roleName}吗？`"
            width="300px"
            @confirm="removeRole(row.id)"
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
    <!-- 分页器    @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasRole"
      @size-change="handlerSize"
    />
  </el-card>
  <!-- 对话框 -->
  <el-dialog
    v-model="dialogVisite"
    :title="RoleParams.id ? '更新职位' : '添加职位'"
  >
    <el-form :model="RoleParams" :rules="rules" ref="form">
      <el-form-item label="职位名称" prop="roleName">
        <el-input
          placeholder="请你输入职位名称"
          v-model="RoleParams.roleName"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="dialogVisite = false">
        取消
      </el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-dialog>
  <!-- 抽屉 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree
        ref="tree"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermisstion,
  reqRemoveRole,
} from '@/api/acl/role'
import type {
  RoleResponseData,
  Records,
  RoleData,
  MenuResponseData,
  MenuList,
} from '@/api/acl/role/type'
import useLayOutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus'

let settingStore = useLayOutSettingStore()
// 分页
let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)

let keyword = ref<string>('')
let allRole = ref<Records>([])

// 对话框
let dialogVisite = ref<boolean>(false)
// 收集新增岗位数据
let RoleParams = reactive<RoleData>({
  roleName: '',
})
// 表单实例
let form = ref<any>()
// 抽屉
let drawer = ref<boolean>(false)

// 树形权限数据
let menuArr = ref<MenuList>([])
// 勾选节点
let selectArr = ref<number[]>([])
// tree实例
let tree = ref<any>()

onMounted(() => {
  getHasRole()
})
const getHasRole = async (pager = 1) => {
  pageNo.value = pager
  let result: RoleResponseData = await reqAllRoleList(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}
const handlerSize = () => {
  getHasRole()
}

// 搜索
const search = () => {
  getHasRole()
  keyword.value = ''
}
// 重置
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}

// 添加职位
const addRole = () => {
  dialogVisite.value = true
  Object.assign(RoleParams, {
    roleName: '',
    id: 0,
  })
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
// 更新职位
const updateRole = (row: RoleData) => {
  dialogVisite.value = true
  Object.assign(RoleParams, row)
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
const validatorRoleName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位名称至少两位'))
  }
}
// 职位表单校验
const rules = {
  roleName: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorRoleName,
    },
  ],
}
// 保存
const save = async () => {
  await form.value.validate()
  // 添加 | 更新职位
  let result: any = await reqAddOrUpdateRole(RoleParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '更新成功' : '添加成功',
    })
    dialogVisite.value = false
    getHasRole(RoleParams.id ? pageNo.value : 1)
  }
}

// 分配权限
const defaultProps = {
  children: 'children',
  label: 'name',
}
const setPermisstion = async (row: RoleData) => {
  drawer.value = true
  // 收集当前要分配权限的职位数据
  Object.assign(RoleParams, row)
  let result: MenuResponseData = await reqAllMenuList(RoleParams.id as number)
  // console.log(result)
  if (result.code == 200) {
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}
// 递归树列表勾选节点
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}
// 确定按钮
const handler = async () => {
  //职位的ID
  const roleId = RoleParams.id as number
  //选中节点的ID
  let arr = tree.value.getCheckedKeys()
  //半选的ID
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)
  //下发权限
  let result: any = await reqSetPermisstion(roleId, permissionId)

  if (result.code == 200) {
    //抽屉关闭
    drawer.value = false
    //提示信息
    ElMessage({ type: 'success', message: '分配权限成功' })
    //页面刷新
    window.location.reload()
  }
}

// 删除
const removeRole = async (id: number) => {
  let result: any = await reqRemoveRole(id)
  // console.log(result)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
