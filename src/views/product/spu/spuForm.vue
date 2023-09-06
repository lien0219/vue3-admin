<template>
  <el-form label-width="130px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请输入SPU名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId">
        <el-option
          v-for="(item, index) in AllTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请输入SPU描述"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select
        v-model="saleAttrIdAndValueName"
        :placeholder="
          unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}` : '无'
        "
      >
        <el-option
          :value="`${item.id}:${item.name}`"
          v-for="(item, index) in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
        ></el-option>
      </el-select>
      <el-button
        :disabled="saleAttrIdAndValueName ? false : true"
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        @click="addSaleAttr"
      >
        添加属性值
      </el-button>
      <!-- table -->
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="销售属性名字"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="销售属性值">
          <template #="{ row, $index }">
            <el-tag
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="row.id"
              class="mx-1"
              closable
              style="margin: 0px 5px"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              v-model="row.saleAttrValue"
              placeholder="请你输入属性值"
              size="small"
              style="width: 150px"
              v-if="row.flag == true"
              @blur="toLook(row)"
            ></el-input>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="Plus"
              @click="toEdit(row)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        :disabled="saleAttr.length > 0 ? false : true"
        type="primary"
        size="default"
        @click="save"
      >
        保存
      </el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SpuData } from '@/api/product/spu/type'
import type {
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  Trademark,
  SpuImg,
  SaleAttr,
  HasSaleAttr,
  SaleAttrValue,
} from '@/api/product/spu/type'
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu'
import { ElIcon, ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScene'])

const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}
// 存储已有的SPU数据
let AllTradeMark = ref<Trademark[]>([])
// 商品图片
let imgList = ref<SpuImg[]>([])
// 已有的SPU销售属性
let saleAttr = ref<SaleAttr[]>([])
// 全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])
// 对话框
let dialogVisible = ref<boolean>(false)
// 图片预览
let dialogImageUrl = ref<string>('')
// 存储已有的spu对象
let SpuParams = ref<SpuData>({
  category3Id: '', //收集三级分类的ID
  spuName: '', //SPU的名字
  description: '', //SPU的描述
  tmId: '', //品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
})

// 收集未选择的属性id和name
let saleAttrIdAndValueName = ref<string>('')

// 子组件方法
const initHasSpuData = async (spu: SpuData) => {
  SpuParams.value = spu
  //   console.log(spu) //spu接收父组件传递过来的SPU对象
  let result: AllTradeMark = await reqAllTradeMark()
  //   console.log(result, 'result')
  let result1: SpuHasImg = await reqSpuImageList(spu.id as number)
  //   console.log(result1, 'result1')
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  //   console.log(result2, 'result2')
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()
  //   console.log(result3, 'result3')

  //   存储全部品牌数据
  AllTradeMark.value = result.data
  //   SPU对应的商品图片
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  // 存储已有的SPU销售属性
  saleAttr.value = result2.data
  //   存储全部的销售属性
  allSaleAttr.value = result3.data
}

// 照片墙预览钩子
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
// 照片墙删除
const handleRemove = () => {
  console.log(11)
}
// 照片上传成功之前约束
const handlerUpload = (file: any) => {
  if (
    file.type == 'image/png' ||
    file.type == 'image/jpeg' ||
    file.type == 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件必须小于3M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件必须为PNG|JPG|GIF',
    })
    return false
  }
}

// 计算当前spu未有的树形
let unSelectSaleAttr = computed(() => {
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})

//添加属性
const addSaleAttr = () => {
  // 收集新增属性id,name
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  saleAttr.value.push(newSaleAttr)
  saleAttrIdAndValueName.value = ''
}
// 属性值按钮事件
const toEdit = (row: SaleAttr) => {
  row.flag = true
  row.saleAttrValue = ''
}
// 输入框失去焦点事件
const toLook = (row: SaleAttr) => {
  // 收集属性值id和name
  const { baseSaleAttrId, saleAttrValue } = row
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }
  // 为空
  if ((saleAttrValue as string).trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  // 已存在
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复',
    })
    return
  }

  row.spuSaleAttrValueList.push(newSaleAttrValue)
  row.flag = false
}

// 保存
const save = async () => {
  // 收集参数
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  SpuParams.value.spuSaleAttrList = saleAttr.value

  let result = await reqAddOrUpdateSpu(SpuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功',
    })
    // 通知父组件切换场景
    $emit('changeScene', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add',
    })
  } else {
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '更新失败' : '添加失败',
    })
  }
}
// 添加新的spu
const initAddSpu = async (c3Id: number | string) => {
  // 清空
  Object.assign(SpuParams.value, {
    category3Id: '', //收集三级分类的ID
    spuName: '', //SPU的名字
    description: '', //SPU的描述
    tmId: '', //品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
  })
  // 清空照片墙
  imgList.value = []
  saleAttr.value = []

  saleAttrIdAndValueName.value = ''

  // 三级分类id
  SpuParams.value.category3Id = c3Id
  // 获取全部品牌数据
  let result: AllTradeMark = await reqAllTradeMark()
  let result1: HasSaleAttrResponseData = await reqAllSaleAttr()

  AllTradeMark.value = result.data
  allSaleAttr.value = result1.data
}
// 对外暴露子组件方法
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped lang="scss">
::v-deep
  .el-upload-list--picture-card
  .el-upload-list__item-actions
  span
  + span {
  /* margin-left: 1rem; */
  margin-left: 0rem !important;
}
</style>
