import { userConfig } from '~~/config/UserConfig'
export default defineEventHandler(async (event) => {
   const query = getQuery(event)   
   return $fetch( userConfig.serviceUrl.userService+'/user/getFileListOfUser',{
      headers:{Authorization: query.token.toString()},
      params: {
         userId:query.userId,
         parentId: query.parentId,
      }
   })
})