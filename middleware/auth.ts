import {User} from '../entity/User.class'

export default defineNuxtRouteMiddleware((to, from) => {
   const user = new User()
   if(typeof useCookie('user').value == 'undefined'){
      navigateTo('/')
      return
   }else{
      user.parse(useCookie('user').value)
   }

   if(typeof user.getToken() == 'undefined'){
      navigateTo('/')
      return
   }
      
})