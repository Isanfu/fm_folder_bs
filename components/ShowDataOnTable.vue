<template>
   <div style="height: 100%;width: 100vw;display:flex; flex-direction: column;">
      <div id="table-header">
         <el-upload style="display: flex;" action="http://localhost:8899/uploadFile" :show-file-list="false"
            :multiple="true" :headers="{ Authorization: user.getToken() }" :data="uploadFileParams"
            :before-upload="beforeUploadFile" :on-success="uploadSuccess" :on-progress="uploadProgress"
            :on-error="uploadError">
            <el-button type="primary" :icon="Upload" size="large" round>文件上传</el-button>
         </el-upload>
         <el-button type="primary" @click="createNewFolder" style="margin-left: 5px" :icon="FolderAdd" size="large"
            round>新建文件夹
         </el-button>
         <el-button-group id="table-header-menu" v-show="isShowHeaderMenu" style="margin-left: 20px;">
            <el-button round @click="shareUserFileDialogVisible = true">分享</el-button>
            <el-button>移动</el-button>
            <el-button round>删除</el-button>
         </el-button-group>
         <!-- 分享dialog -->
         <client-only>
            <el-dialog v-model="shareUserFileDialogVisible" title="文件分享" width="30%">
               <template #header>
                  <div id="share-dialog">

                     <div id="share-dialog-header">
                        分享文件：
                        <!-- <em v-show="selectedRows.length == 1">&nbsp;&nbsp;{{ selectedRows[0].filename }}</em>
                        <em v-show="selectedRows.length > 1">&nbsp;&nbsp;{{ selectedRows[0].filename }}等</em>  -->
                     </div>
                  </div>
               </template>
               <div id="share-dialog-body">
                <em>分享链接：http://localhost/</em>
               </div>
               <template #footer>
                  <span class="dialog-footer">
                     <el-button @click="shareUserFileDialogVisible = false">取消</el-button>
                     <el-button type="primary" @click="confirmMoveUserFile">
                        确认
                     </el-button>
                  </span>
               </template>
            </el-dialog>
            <!-- 移动文件 -->
            <el-dialog v-model="moveUserFileDialogVisible" width="30%">
               <template #header>
                  <span>移动到</span>
                  <br>
                  <br>
                  <el-breadcrumb :separator-icon="ArrowRight">
                     <el-breadcrumb-item @click="toNetPath(item)" v-for="item of routeOfMoveUserFile">{{ item.name }}
                     </el-breadcrumb-item>
                  </el-breadcrumb>
                  <el-table ref="userFileDataRef" :data="moveMenuOfUserFile" height="100%" width="100%"
                     :highlight-current-row="true">
                     <el-table-column prop="filename">
                        <template #default="scope">
                           <div slot="reference" class="name-wrapper" style="width: 100%">
                              <div id="col-filename">
                                 <img id="filename-icon" :src="scope.row.iconHref" alt="">
                                 <el-button text @click="getFolderDataOfMoveMenu(scope.row)"> {{ scope.row.filename }}
                                 </el-button>
                              </div>
                           </div>
                        </template>
                     </el-table-column>
                  </el-table>
               </template>

               <template #footer>
                  <span class="dialog-footer">
                     <el-button @click="moveUserFileDialogVisible = false">取消</el-button>
                     <el-button type="primary" @click="confirmMoveUserFile">确认</el-button>
                  </span>
               </template>
            </el-dialog>
         </client-only>


      </div>

      <el-table ref="userFileDataRef" :data="useTableDataStore().tableData" height="100%" width="100%"
         :highlight-current-row="true" @selection-change="handleSelectionChange" @row-click="checkedCurrRow">
         <el-table-column type="selection" width="40" />
         <el-table-column sortable prop="filename" label="文件名" width="480">
            <template #default="scope">
               <div @mouseenter.self="showRowMenu(scope.row)" slot="reference" class="name-wrapper" style="width: 100%">
                  <div id="col-filename">
                     <img id="filename-icon" :src="scope.row.iconHref" alt="">
                     <el-button text @click="getFolderData(scope.row)"> {{ scope.row.filename }} </el-button>
                     <div class="col-filename-menu" :id="scope.row.rowId" v-show="isShowRowMenu">
                        <el-button link :icon="Share" @click="fileShare(scope.row)" />
                        <el-button link :icon="FolderOpened" title="移动" @click="singleFileMove(scope.row)" />
                        <el-button link :icon="Download" @click="downloadFile(scope.row)" />
                        <el-button link :icon="Delete" />
                     </div>
                  </div>
               </div>
            </template>
         </el-table-column>
         <el-table-column sortable prop="modifyTime" label="修改时间" width="180" />
         <el-table-column sortable prop="fileSize" label="大小" />
         <template #empty>
            数据为空
         </template>
      </el-table>



   </div>

</template>
<script lang="ts" setup>
import { Share, FolderOpened, Upload, Download, Delete, FolderAdd, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { ref, reactive,  watch } from 'vue'  //变量声明
import type {UploadRawFile, UploadFile, UploadFiles, UploadProgressEvent, ElTable } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ParallelHasher } from 'ts-md5';
import { UserFile } from '~~/entity/UserFile.class'
import { useUserStore } from '@/stores/useUserStore'
import { useFileStore } from "@/stores/useFileStore";
import { useRouteStore } from '@/stores/useRouteStore';
import { useTableDataStore } from "@/stores/useTableDataStore";
const {  $fileHttp,  $dataFormat,$encrypt,$decrypt } = useNuxtApp()
const user = useUserStore().user
const fileList = useFileStore().fileList
const routeStack = useRouteStore().routeStack
const moveMenuOfUserFile = ref([])

const shareUserFileDialogVisible = ref(false)
const moveUserFileDialogVisible = ref(false)

const routeOfMoveUserFile = ref([
   {
      key: '0',
      name: '文件',
      netPath: `/${user.getId()}/`
   }
])
let willMoveFile = ref()
function singleFileMove(row: any) {
   moveUserFileDialogVisible.value = true
   willMoveFile.value = row
}



console.log($encrypt('hello','qiweuyqiuwey'));
console.log($decrypt($encrypt('hello','qiweuyqiuwey'),'qiweuyqiuwey'));




function getFolderListData(parentId: string) {
   $fetch('/api/getFolderListOfUser', {
      method: 'get',
      params: {
         parentId: parentId,
         token: user.getToken(),
         userId: user.getId()
      }
   }).then(res => {
      moveMenuOfUserFile.value = $dataFormat(res)
   })
}

getFolderListData('0')


function getFolderDataOfMoveMenu(row) {
   routeOfMoveUserFile.value.push({
      key: row.id,
      name: row.filename,
      netPath: row.netPath
   })
}

function toNetPath(routeItem: any) {
   const idxItem = routeOfMoveUserFile.value.findIndex(item => {
      return item.key == routeItem.key
   })
   routeOfMoveUserFile.value.splice(idxItem + 1)
}


watch(routeOfMoveUserFile, () => {
   getFolderListData(routeOfMoveUserFile.value[routeOfMoveUserFile.value.length - 1].key)
}, {
   deep: true
})

function confirmMoveUserFile() {
   moveUserFileDialogVisible.value = false
   console.log(routeOfMoveUserFile.value[routeOfMoveUserFile.value.length - 1]);
   console.log(willMoveFile.value);
   if (willMoveFile.value.id != routeOfMoveUserFile.value[routeOfMoveUserFile.value.length - 1].key && willMoveFile.value.parentId != routeOfMoveUserFile.value[routeOfMoveUserFile.value.length - 1].key) {
      $fetch('/api/moveUserFile', {
         method: 'post',
         body: {
            currUserFileId: willMoveFile.value.id,
            token: user.getToken(),
            userId: user.getId(),
            parentId: routeOfMoveUserFile.value[routeOfMoveUserFile.value.length - 1].key,
            netPath: routeOfMoveUserFile.value[routeOfMoveUserFile.value.length - 1].netPath,
         }
      })
      ElMessage({
         message: `移动成功`,
         type: 'success',
      })
   }

   else {
      ElMessage({
         message: `移动失败`,
         type: 'warning',
      })
   }


}




const shareUserFileMethods = ref([{
   label: '链接分享',
   value: 'linkShare'
},
{
   label: '分享码分享',
   value: 'shareNum'
}

])

const selectedShareMethod = ref()
let willShareFile = ref([])



function fileShare(row?: any) {
   shareUserFileDialogVisible.value = true
   

   
   

}



//文件上传请求参数
const uploadFileParams = reactive({
   userId: user.getId(),
   parentId: useRouteStore().top().key,
   netPath: useRouteStore().top().netPath
})



let isShowRowMenu = ref(false)
let isShowHeaderMenu = ref(false)
const selectedRows = ref([])
const md5_worker = new URL('/md5_worker.js', import.meta.url).href

// const data = defineProps(['data'])



const userFileDataRef = ref<InstanceType<typeof ElTable>>()
function checkedCurrRow(row, column, event) {
   useTableDataStore().tableData.forEach(item => {
      if (row.rowId == item.rowId) {
         userFileDataRef.value.toggleRowSelection(row, true)
      } else {
         userFileDataRef.value.toggleRowSelection(item, false)
      }
   })
}

function getFolderData(row: any) {
   if (row.isDir == 1)
      useRouteStore().push(row)
}

function downloadFile(row: any) {
   if (row.isDir == 0)
      window.open((decodeURIComponent(`http://localhost:9797/downloadFile/${row.filename}?${row.fileId}`)))
}



function getUserFileData(parentId: string) {
   $fetch('/api/getFileListOfUser', {
      method: 'get',
      params: {
         parentId: parentId,
         token: user.getToken(),
         userId: user.getId()
      }
   }).then((res: Array<any>) => {
      useTableDataStore().tableData = $dataFormat(res)
   })
}
//根目录数据
getUserFileData('0')

useRouteStore().$subscribe(() => {
   uploadFileParams.parentId = useRouteStore().top().key
   getUserFileData(useRouteStore().top().key)
})



function createNewFolder() {
   console.log(useRouteStore().top().key);

   ElMessageBox.prompt('请输入文件夹名', 'Tip', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputPattern: /^[\u4E00-\u9FA5a-zA-Z0-9_-]{1,20}$/,
      inputErrorMessage: '无效文件夹名',
   }).then(({ value }) => {
      $fetch('/api/createNewFolder', {
         method: 'post',
         body: {
            folderName: value,
            parentId: useRouteStore().top().key
         }
      })
   }).catch(() => {
      console.log('cancel input');
   })

}

function shareUserFile() {

}


//展示行菜单
function showRowMenu(rowData: { rowId: string; data: string; }) {
   if (!isShowRowMenu.value)
      isShowRowMenu.value = true
   const currRow = document.getElementById(rowData.rowId)
   currRow.style.visibility = 'visible'

   for (const row of useTableDataStore().tableData) {
      if (row.rowId != rowData.rowId) {
         let tmpRow = document.getElementById(row.rowId);
         tmpRow.style.visibility = 'hidden'
      }
   }
}

//处理选择行事件
function handleSelectionChange(val: any) {
   selectedRows.value = val
}

//监听已选行
watch(selectedRows, () => {
   selectedRows.value.length > 0 ? isShowHeaderMenu.value = true : isShowHeaderMenu.value = false
})


//上传之前先验证文件md5在服务器中是否已存在
function beforeUploadFile(rawFile: UploadRawFile) {
   return new Promise((resolve, reject) => {
      let hasher = new ParallelHasher(md5_worker);
      hasher.hash(rawFile).then(function (result) {
         $fileHttp.get('/file/checkFileExist', {
            headers: { 'Content-Md5': result.toString() },
            params: {
               userId: user.getId(),
               fileName: rawFile.name,
               parentId: routeStack[routeStack.length - 1].key,
               netPath: routeStack[routeStack.length - 1].netPath
            }
         }).then(res => {
            //文件不存在,上传
            useFileStore().add(new UserFile(rawFile.name, result.toString()))
            if (res.data.status == 200) {
               resolve(200)
            } else {
               //文件存在，放弃上传，并标记为在服务器上已存在
               for (const item of fileList) {
                  if (item.fileName == rawFile.name)
                     item.isExistOnServer = 1
               }
               reject(201)
            }
         })

      });
   })
}

function uploadProgress(evt: UploadProgressEvent, uploadFile: UploadFile, uploadFiles: UploadFiles) {
   for (const item of useFileStore().fileList) {
      if (item.fileName == uploadFile.name) {
         // console.log(item.fileName,uploadFile.name);
         item.uploadProgress = evt.percent.toString()
      }
   }
}

function uploadSuccess(response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) {
   // console.log(uploadFile);
   // console.log(uploadFiles);
   for (const item of fileList) {
      if (item.isExistOnServer != 1 && response.fileMd5 == item.fileMd5) {
         ElMessage({
            message: `文件上传成功：${item.fileName}`,
            type: 'success',
         })
         return
      }
   }
   ElMessage({
      message: `文件上传出错：${uploadFile.name}`,
      type: 'warning',
   })
}

function uploadError(error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) {
   console.log(error);
   ElMessage({
      message: `文件上传失败：${uploadFile.name}`,
      type: 'warning',
   })
}



</script>
<style lang="less" scoped>
@import url('../assets/styles/values.less');

#col-filename {
   display: flex;
   align-items: center;

   & :deep(.el-button) {
      color: black
   }
}

#filename-icon {
   width: 30px;
   height: 30px;
}

#table-header {
   height: 70px;
   width: 100vw;
   display: flex;
   padding-left: 10px;
   align-items: center;
   border-bottom: 1px solid #ebeef5;
}

.col-filename-menu {
   margin-left: auto;

   & :deep(.el-icon) {
      color: @themeColor;
   }
}

#share-dialog {
   display: flex;
   flex-direction: column;
}

#share-dialog-body {
   width: 100%;

}

:deep(.el-table) {
   color: black;
   border-radius: 10px;
}


:deep(.el-button.is-text:not(.is-disabled):active) {
   color: @themeColor;
   background: transparent;
}

:deep(.el-button.is-text:not(.is-disabled):focus) {
   color: @themeColor;
   background: transparent;
}
</style>