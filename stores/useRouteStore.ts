import { defineStore } from 'pinia'
import { User } from '~~/entity/User.class';


export const useRouteStore = defineStore('routeStore', () => {

   const routeStack = ref([])

   const user = new User()
   user.parse(useCookie('user').value)



   routeStack.value.push({
      key: '0',
      name: '文件',
      netPath: `/${user.getId()}/`
   })

   function top() {
      return routeStack.value[routeStack.value.length - 1]
   }

   function to(routeItem: any){
      const idxItem = routeStack.value.findIndex(item=>{
         return item.key == routeItem.key
      })
      routeStack.value.splice(idxItem+1)
   }

   function push(routeItem: any) {
      routeStack.value.push({
         key: routeItem.id,
         name: routeItem.filename,
         netPath: routeItem.netPath
      })
   }

   function pop() {
      return routeStack.value.pop()
   }



   return { routeStack, push, top, pop,to }
})