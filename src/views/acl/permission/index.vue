<template>
  <el-table
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
    :data="PermisstionArr"
  >
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="权限值" prop="code"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column label="操作">
      <template #="{ row }">
        <el-button
          type="primary"
          size="small"
          :disabled="row.level == 4 ? true : false"
          @click="addPermisstion(row)"
        >
          {{ row.level == 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="row.level == 1 ? true : false"
          @click="updatePermisstion(row)"
        >
          编辑
        </el-button>
        <el-popconfirm
          :title="`你确定要删除${row.name}吗?`"
          width="260px"
          @confirm="removeMenu(row.id)"
        >
          <template #reference>
            <el-button
              type="primary"
              size="small"
              :disabled="row.level == 1 ? true : false"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 对话框 添加|编辑 -->
  <el-dialog
    v-model="dialogVisible"
    :title="menuData.id ? '更新菜单' : '添加菜单'"
  >
    <el-form>
      <el-form-item label="名称">
        <el-input
          placeholder="请输入菜单名称"
          v-model="menuData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-input
          placeholder="请输入权限数值"
          v-model="menuData.code"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import {
  reqAllPermisstion,
  reqAddOrUpdateMenu,
  reqRemoveMenu,
} from '@/api/acl/menu'
import type {
  PermisstionResponseData,
  PermisstionList,
  Permisstion,
  MenuParams,
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'

// 菜单数据
let PermisstionArr = ref<PermisstionList>([])
// 弹窗
let dialogVisible = ref<boolean>(false)
// 携带的参数
let menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0,
})

onMounted(() => {
  getHasPermisstion()
})

// 菜单数据
const getHasPermisstion = async () => {
  let result: PermisstionResponseData = await reqAllPermisstion()
  if (result.code == 200) {
    PermisstionArr.value = result.data
  }
}
// 添加菜单
const addPermisstion = (row: Permisstion) => {
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0,
  })

  dialogVisible.value = true
  // console.log(row)
  menuData.level = row.level + 1
  menuData.pid = row.pid
}
// 编辑
const updatePermisstion = (row: Permisstion) => {
  dialogVisible.value = true
  // 收集参数
  Object.assign(menuData, row)
}
// 确定保存
const save = async () => {
  // 新增 | 编辑
  let result: any = await reqAddOrUpdateMenu(menuData)
  if (result.code == 200) {
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: menuData.id ? '更新成功' : '添加成功',
    })
    getHasPermisstion()
  }
}
// 删除
const removeMenu = async (id: number) => {
  let result: any = await reqRemoveMenu(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasPermisstion()
  }
}
</script>

<style scoped></style>
