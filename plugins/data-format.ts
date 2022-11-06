import {filesize} from "filesize";
import moment from 'moment'
export function format(reqData: Array<any>){
   let i = 1
   for (const item of reqData) {
      item.rowId = i;
      i++
      item.fileSize = item.isDir==0?filesize(item.fileSize, {base: 2, standard: "jedec"}):''
      item.createTime = moment(parseInt(item.createTime)).format('YYYY-MM-DD hh:mm')
      item.modifyTime = moment(parseInt(item.modifyTime)).format('YYYY-MM-DD hh:mm')
      item.iconHref = item.isDir==0?new URL(`../assets/icons/${item.fileType}.svg`, import.meta.url).href:new URL(`../assets/icons/folder.svg`, import.meta.url).href
   }

   return reqData
}
export default defineNuxtPlugin((nuxtApp) => {

   return {
      provide: {
         dataFormat: format
      }
   }
})

