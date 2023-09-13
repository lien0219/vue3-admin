<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="价格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(g)">
      <el-input
        placeholder="重量(g)"
        type="number"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select v-model="item.attrIdAndValueId">
            <el-option
              :value="`${item.id}:${attrValue.id}`"
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item
          v-for="item in saleArr"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select v-model="item.saleIdAndValueId">
            <el-option
              :value="`${item.id}:${saleAttrValue.id}`"
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column
          type="selection"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="图片">
          <template #="{ row }">
            <img :src="row.imgUrl" alt="" style="widows: 60px; height: 60px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button type="primary" size="small" @click="handler(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reqAttr } from '@/api/product/attr'
import {
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAddSku,
} from '@/api/product/spu'
import type { SkuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'

// 平台属性
let attrArr = ref<any>([])
// 销售属性
let saleArr = ref<any>([])
// 照片数据
let imgArr = ref<any>([])
// 收集sku参数
let skuParams = reactive<SkuData>({
  // 父组件传递过来的
  category3Id: '', //三级分类id
  spuId: '', //已有的spu的id
  tmId: '', //spu品牌的id
  // v-model收集
  skuName: '', //sku名字
  price: '', //sku价格
  weight: '', //sku重量
  skuDesc: '', //sku描述
  skuAttrValueList: [
    // 平台属性收集
    // {
    //   attrId: '', //平台属性的id
    //   valueId: '', //属性值的id
    // },
  ],
  skuSaleAttrValueList: [
    //销售属性
    // {
    //   saleAttrId: '', //属性id
    //   saleAttrValueId: '', //属性值id
    // },
  ],
  skuDefaultImg: '', //sku图片地址
})
// 获取table组件实例
let table = ref<any>()
// 取消按钮
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}

// 对外暴露
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any,
) => {
  // 收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  //  获取平台属性
  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id)
  // 销售属性
  let result1: any = await reqSpuHasSaleAttr(spu.id)
  // 照片墙数据
  let result2: any = await reqSpuImageList(spu.id)

  attrArr.value = result.data
  saleArr.value = result1.data
  imgArr.value = result2.data
}

// 设置默认图片
const handler = (row: any) => {
  imgArr.value.forEach((item: any) => {
    // 复选框默认全不选
    table.value.toggleRowSelection(item, false)
  })
  // 复选框选中
  table.value.toggleRowSelection(row, true)

  skuParams.skuDefaultImg = row.imgUrl
}

// 保存
const save = async () => {
  // 平台属性参数
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({
        attrId,
        valueId,
      })
    }
    return prev
  }, [])
  // 销售属性参数
  skuParams.skuAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
      prev.push({
        saleAttrId,
        saleAttrValueId,
      })
    }
    return prev
  }, [])
  // 请求
  let result: any = await reqAddSku(skuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加SKU成功',
    })
    // 通知父组件切换场景
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加SKU失败',
    })
  }
}

let $emit = defineEmits(['changeScene'])
defineExpose({ initSkuData })
</script>

<style scoped></style>
