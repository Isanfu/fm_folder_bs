import { defineStore } from 'pinia'
import { UserFile } from '@/entity/UserFile.class'
export const useFileStore = defineStore('fileStore', () => {
   const fileList = ref<UserFile[]>([])
   function add(file: UserFile) {
      fileList.value.push(file)
   }
   
   return { fileList, add }
})