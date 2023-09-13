<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到XXXXX</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login_btn"
              type="primary"
              size="default"
              :loading="loading"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'

let useStore = useUserStore()

let loginForms = ref()
// 获取路由器
let $router = useRouter()
let $route = useRoute()
let loading = ref(false)
let loginForm = reactive({ username: 'admin', password: 'atguigu123' })

// 登录
const login = async () => {
  console.log(loginForms)
  // 全部校验
  await loginForms.value.validate()

  loading.value = true
  try {
    await useStore.userLogin(loginForm)
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `HI,${getTime()}好`,
    })
    loading.value = false
  } catch (error) {
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
// 自定义校验规则
const validatorUserName = (rule: any, value: any, callback: any) => {
  console.log(rule)

  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度5-10位'))
  }
}
const validatorPassWord = (rule: any, value: any, callback: any) => {
  console.log(rule)

  if (value.length >= 6) {
    callback()
  } else {
    callback(new EvalError('密码长度至少六位'))
  }
}
// 表单校验
const rules = {
  username: [
    // { required: true, message: '用户名不能为空', trigger: 'blur' },
    // {
    //   required: true,
    //   min: 5,
    //   max: 10,
    //   message: '账号长度至少五位',
    //   trigger: 'blur',
    // },
    { trigger: 'change', validator: validatorUserName },
  ],
  password: [
    // { required: true, message: '密码不能为空', trigger: 'change' },
    // {
    //   required: true,
    //   min: 6,
    //   max: 15,
    //   message: '密码长度至少六位',
    //   trigger: 'change',
    // },
    { trigger: 'change', validator: validatorPassWord },
  ],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;
    h1 {
      color: white;
      font-size: 40px;
    }
    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0px;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
