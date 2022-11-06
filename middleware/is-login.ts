import { useUserStore } from '@/stores/useUserStore'

export default defineNuxtRouteMiddleware((to, from) => {
   if(typeof useCookie('user').value != 'undefined'){
      const user = useUserStore().user
      user.parse(useCookie('user').value)

      

      navigateTo('/userPage')
   }
})