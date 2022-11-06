import { defineStore } from 'pinia'


export const useTableDataStore = defineStore('useTableData', ()=>{
   let tableData: any = ref([])
   return { tableData}
})