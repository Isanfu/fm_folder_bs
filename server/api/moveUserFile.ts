import { userConfig } from '~~/config/UserConfig'
export default defineEventHandler(async (event) => {
   const body = await readBody(event)   
   return $fetch( userConfig.serviceUrl.userService+'/user/moveUserFile',{
      method: 'post',
      headers:{Authorization: body.token},
      params: {
         userId:body.userId,
         currUserFileId: body.currUserFileId,
         parentId: body.parentId,
         netPath: body.netPath
      }
   })
})