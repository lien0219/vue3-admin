<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          @click="addSpu"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
        >
          添加SPU
        </el-button>
        <el-table style="margin: 10px 0px" border :data="records">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="SPU操作">
            <template #="{ row }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SPU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="修改SKU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看SPU列表"
                @click="findSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.spuName}?`"
                style="width: 160px"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器    @size-change="handleSizeChange"
      @current-change="handleCurrentChange"-->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
      <!-- 添加|修改Spu子组件 -->
      <SpuForm
        ref="spu"
        v-show="scene == 1"
        @changeScene="changeScene"
      ></SpuForm>
      <!-- 添加SKU的子组件 -->
      <SkuForm
        ref="sku"
        v-show="scene == 2"
        @changeScene="changeScene"
      ></SkuForm>
      <!-- dialog对话框：展示已有的sku列表 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row }">
              <img
                :src="row.skuDefaultImg"
                alt=""
                style="width: 60px; height: 60px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
import type {
  HasSpuResponseData,
  Records,
  SkuInfoData,
  SkuData,
} from '@/api/product/spu/type'
import type { SpuData } from '@/api/product/spu/type'
import useCategoryStore from '@/store/modules/category'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()

// 场景切换
let scene = ref<number>(0)
// 默认页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(3)
// 存储全部数据
let records = ref<Records>([])
// spu总数
let total = ref<number>(0)
//获取子组件spuForm实例
const spu = ref<any>()
//获取子组件skuForm实例
let sku = ref<any>()
// 存储全部的SKU数据
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)

// 监听三级分类ID变化
watch(
  () => categoryStore.c3Id,
  () => {
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)

// 获取已有spu全部数据
const getHasSpu = async (pager = 1) => {
  // 修改当前页码
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  // console.log(result)
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
// 分页器下拉触发
const changeSize = () => {
  getHasSpu()
}

// 添加spu
const addSpu = () => {
  scene.value = 1
  // 调用子组件添加方法
  spu.value.initAddSpu(categoryStore.c3Id)
}
// 子组件自定义事件
const changeScene = (obj: any) => {
  scene.value = obj.flag
  if (obj.params == 'update') {
    // 更新留在当前页面
    getHasSpu(pageNo.value)
  } else {
    // 添加留在第一页
    getHasSpu()
  }
}
// 修改
const updateSpu = (row: SpuData) => {
  scene.value = 1
  // console.log(spu.value)
  // 调用子组件方法
  spu.value.initHasSpuData(row)
}

// 添加sku
const addSku = (row: SpuData) => {
  // 点击添加sku按钮切换场景2
  scene.value = 2
  // 子组件方法
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

// 查看sku列表
const findSku = async (row: SpuData) => {
  let result: SkuInfoData = await reqSkuList(row.id as number)
  if (result.code == 200) {
    skuArr.value = result.data
    show.value = true
  }
}

// 删除spu
const deleteSpu = async (row: SpuData) => {
  let result: any = await reqRemoveSpu(row.id as number)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 获取剩余SPU数据
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

// 路由组件销毁前清除分类数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped></style>
