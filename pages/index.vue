<template>
   <div id="container" ref="container">
      <div id="login-form">
         <el-tabs v-model="activeName">
            <el-tab-pane label="用户" name="first" id="login-pane">
               <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
                  <el-form-item prop="username">
                     <el-input v-model="loginForm.username" placeholder="用户名" />
                  </el-form-item>
                  <el-form-item prop="password">
                     <el-input type="password" v-model="loginForm.password" placeholder="密码" clearable />
                  </el-form-item>
               </el-form>
               <el-form-item>
                  <el-button type="primary" id="submit-user" @click="submitForm(loginFormRef)">登录/注册</el-button>
               </el-form-item>
            </el-tab-pane>
         </el-tabs>
      </div>
   </div>
</template>
<script setup lang="ts">
import { ref, reactive, getCurrentInstance } from 'vue'  //变量声明
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/useUserStore'
import { useTableDataStore } from "@/stores/useTableDataStore";

import { Md5 } from 'ts-md5'

const { proxy } = getCurrentInstance()   // 钩子函数中的this
const user = useUserStore().user
const { $http } = useNuxtApp()
const userCookie = useCookie('user')
let tableData = useTableDataStore().tableData

definePageMeta({
   middleware: ["is-login"]
})

const activeName = ref('first')
const loginForm = reactive({
   username: '',
   password: ''
})

const loginFormRef = ref<FormInstance>()

const loginFormRules = reactive<FormRules>({
   username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { message: '用户名长度应当在2-20之间, 仅支持: 中文a-zA-Z0-9_-', trigger: 'blur', pattern: /^[\u4E00-\u9FA5a-zA-Z0-9_-]{2,20}$/ },
   ],
   password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { message: '密码长度: 6-32, 仅支持: a-zA-Z0-9_-', trigger: 'blur', pattern: /^[a-zA-Z0-9_-]{6,32}$/ },
   ]
})

onMounted(() => {
   const container: any = proxy.$refs.container
   container.style.width = 100 + 'vw'
   container.style.height = 100 + 'vh'
})

//表单验证提交
async function submitForm(formEl: FormInstance | undefined) {

   if (!formEl) return
   await formEl.validate((valid, fields) => {
      if (valid) {
         $http.post('/user/login', {
            username: loginForm.username,
            password: Md5.hashStr(loginForm.password)
         }).then(res => {
            console.log(res);
            console.log(res.data);
            user.setToken(res.data.token)
            user.setId(res.data.user.id)
            user.setUsername(res.data.user.username)
            user.setCreateTime(res.data.user.createTime)
            user.setModifyTime(res.data.user.modifyTime)
            userCookie.value = JSON.stringify(user)
            
            navigateTo('/userPage')
         }).catch(err => {
            console.log(err);
            ElMessage({
               showClose: true,
               message: '账号或密码错误',
               type: 'warning',
            })
         })
      } else {
         console.log('error submit!', fields)
      }
   })
}
</script>
<style lang="less" scoped>
@import url('../assets/styles/values.less');

#container {
   background-color: @bgColor;
   display: flex;
   align-items: center;
   justify-content: center;
}

#login-form {
   width: 320px;
   height: 450px;
   padding: 20px;
   background-color: @frColor;
}

#login-pane {
   margin-top: 15px;
}

#submit-user {
   margin-top: 60px;
   width: 100%;
}

:deep(.el-input__wrapper) {
   margin-top: 10px;
   border-radius: 0px;
   box-shadow: 0 0 0 0;
   border-bottom: 1px #dedfe0 solid;
   padding-left: 0px;
}

:deep(.el-input__wrapper.is-focus) {
   border-radius: 0px;
   padding-left: 0px;
   box-shadow: 0 0 0 0;
   border-bottom: 1px @themeColor solid;
}

:deep(.el-form-item.is-error .el-input__wrapper) {
   border-radius: 0px;
   padding-left: 0px;
   box-shadow: 0 0 0 0;
   border-bottom: 1px @themeColor solid;
}
</style>