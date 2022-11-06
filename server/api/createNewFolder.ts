import { useUserStore } from '@/stores/useUserStore'
import { useRouteStore } from '@/stores/useRouteStore'
import { userConfig } from '~~/config/UserConfig'
export default defineEventHandler(async (event) => {
   const body = await readBody(event)
   console.log('aa: '+body.folderName);
   console.log( useRouteStore().top().netPath+body.folderName+'/');
   
   return $fetch( userConfig.serviceUrl.userService+'/user/createNewFolder',{
      method: 'post',
      headers:{Authorization: useUserStore().user.getToken()},
      body: {
         userId:useUserStore().user.getId(),
         parentId: body.parentId,
         netPath: useRouteStore().top().netPath+body.folderName+'/',
         filename: body.folderName,
         isDir: 1,
         modifyTime: Date.now(),
         createTime: Date.now()
      }
   })
})