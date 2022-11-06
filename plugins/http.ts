
import axios from 'axios'
import { useUserStore } from '@/stores/useUserStore'

//用户请求
const userServiceUrl: string = 'http://localhost:8080'
const userInstance = axios.create({
   baseURL: userServiceUrl,
   timeout: 10000,
   headers: {
      "Content-Type": "application/json;"
   }
})

userInstance.interceptors.request.use((config) => {
   const user = useUserStore().user
   config.headers['Authorization'] = user.getToken()
   return config
}, (err) => {
   return Promise.reject(err)
})

//文件请求
const fileServiceUrl: string = 'http://localhost:8899'
const fileInstance = axios.create({
   baseURL: fileServiceUrl,
   timeout: 10000,
   headers: {
      "Content-Type": "application/json;"
   }
})

const userFetch = async (url:string)=>{
   const user = useUserStore().user
   return  $fetch('http://localhost:8080'+url,{
      headers: {
         Authorization: user.getToken()
      }
   })
}




export default defineNuxtPlugin((nuxtApp) => {

   return {
      provide: {
         http: userInstance,
         fileHttp: fileInstance,
         userFetch
      }
   }
})
