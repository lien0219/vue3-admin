<template>
  <el-card class="box-card">
    <!-- 添加品牌按钮 -->
    <el-button
      type="primary"
      size="default"
      icon="Plus"
      @click="addTrademark"
      v-has="`btn.Trademark.add`"
    >
      添加品牌
    </el-button>
    <!-- 表格展示平台数据 -->
    <el-table style="margin: 10px 0px" border :data="trademarkArr">
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column label="品牌名称">
        <template #="{ row }">
          <pre style="color: brown">
            {{ row.tmName }}
          </pre>
        </template>
      </el-table-column>
      <el-table-column label="品牌LOGO">
        <template #="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #="{ row }">
          <!-- 操作 -->
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateTrademark(row)"
          ></el-button>
          <!-- 气泡框 -->
          <el-popconfirm
            :title="`你确定删除${row.tmName}?`"
            width="250px"
            icon="Delete"
            @confirm="removeTradeMark(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!--     @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <el-pagination
      @current-change="getHasTrademark"
      @size-change="sizeChange"
      :pager-count="5"
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper,sizes,total"
      :total="total"
    />
  </el-card>
  <!-- 对话框（添加品牌） -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
  >
    <el-form
      style="width: 80%"
      :model="trademarkParams"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="品牌名称" label-width="130px" prop="tmName">
        <el-input
          placeholder="请你输入品牌的名称"
          v-model="trademarkParams.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="130px" prop="logoUrl">
        <!-- 图片上传 -->
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 具名插槽：footer -->
    <template #footer>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
      <el-button type="primary" size="default" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import type {
  Records,
  TradeMarkResponseData,
  TradeMark,
} from '@/api/product/trademark/type'

// 当前页码
let pageNo = ref<number>(1)
//每页展示数据的条数
let limit = ref<number>(3)
// 数据总数
let total = ref<number>(0)
// 品牌数据
let trademarkArr = ref<Records>([])
// 对话框显示隐藏
let dialogFormVisible = ref<boolean>(false)
// 收集新增品牌
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
// 获取el-form实例
let formRef = ref()
// 获取已有品牌接口
const getHasTrademark = async (pager = 1) => {
  // 当前页码
  pageNo.value = pager
  let result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
onMounted(() => {
  getHasTrademark()
})

// 分页器页码变化
// const changePageNo = () => {
//   getHasTrademark()
// }

// 页码下拉菜单
const sizeChange = () => {
  getHasTrademark()
}
// 添加品牌
const addTrademark = () => {
  dialogFormVisible.value = true
  // 清空历史数据
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  // 清除上一次校验结果   第一种写法
  // formRef.value?.clearValidate('tmName') //?有就调用没有就不调用方法
  // formRef.value?.clearValidate('logoUrl')
  // 第二种写法
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
// 修改品牌
const updateTrademark = (row: TradeMark) => {
  // 清除上一次校验结果
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  dialogFormVisible.value = true
  // console.log(row)
  // trademarkParams.id = row.id
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl

  // es6 精简（合并对象）
  Object.assign(trademarkParams, row)
}
// 对话框底部按钮
const cancel = () => {
  // 对话框隐藏
  dialogFormVisible.value = false
  // 清空历史数据
  // trademarkParams.tmName = ''
  // trademarkParams.logoUrl = ''
}
const confirm = async () => {
  // 请求之前对表单校验
  await formRef.value.validate()

  // 对话框隐藏
  // dialogFormVisible.value = false
  let result: any = await reqAddOrUpdateTrademark(trademarkParams) //添加||修改品牌
  // console.log(result)
  if (result.code == 200) {
    // 对话框隐藏
    dialogFormVisible.value = false
    // 弹出提示信息
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    // 重新发送请求获取最新数据
    getHasTrademark(trademarkParams.id ? pageNo.value : 1) //判断是否留在当前页
    // 清空历史数据
    // trademarkParams.tmName = ''
    // trademarkParams.logoUrl = ''
  } else {
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
    dialogFormVisible.value = false
  }
}
// 上传图片之前触发，约束文件类型以及大小
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 上传文件格式png|jpg|gif   4M
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小小于4M',
      })
      return true
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式必须为PNG|JPG|GIF',
    })
    return false
  }
}
// 图片上传成功触发
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  // uploadFile,
) => {
  // response 服务器返回的数据
  // console.log(response, uploadFile)
  // 收集上传图片的地址，添加新品牌的时候带给服务器
  trademarkParams.logoUrl = response.data
  // 图片上传成功清除图片校验结果
  formRef.value.clearValidate('logoUrl')
}

// 品牌自定义校验
const validatorTmName = (rule: any, value: any, callBack: any) => {
  console.log(rule)

  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称大于等于两位'))
  }
}
// 品牌logo自定义校验
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  console.log(rule)

  if (value) {
    callBack()
  } else {
    callBack(new Error('LOGO图片必选'))
  }
}
// 表单校验
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}
// 删除  气泡确认
const removeTradeMark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    // 再次请求已有品牌数据
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
