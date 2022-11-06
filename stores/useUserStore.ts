import { defineStore } from 'pinia'
import { User } from '@/entity/User.class'

export const useUserStore = defineStore('userStore', ()=>{
   const user = new User()
   return { user }
})