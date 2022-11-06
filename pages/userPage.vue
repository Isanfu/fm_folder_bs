<template>
   <div class="fm-container">
      <div id="fm-aside">
         <span class="aside-group-name">文件</span>
         <div class="aside-btn-group">
            <div class="aside-btn-warpper">
               <el-button id="btn1" @click="checked('btn1')" :icon="Folder" ref="btn1">我的文件</el-button>
            </div>
            <div class="aside-btn-warpper">
               <el-button id="btn2" @click="checked('btn2')" :icon="Share">我的分享</el-button>
            </div>

            <div class="aside-btn-warpper">
               <el-button id="btn3" @click="checked('btn3')" :icon="VideoCamera">视频</el-button>
            </div>

            <div class="aside-btn-warpper">
               <el-button id="btn4" @click="checked('btn4')" :icon="Headset">音频</el-button>
            </div>

            <div class="aside-btn-warpper">
               <el-button id="btn5" @click="checked('btn5')" :icon="Picture">图片</el-button>
            </div>

            <div class="aside-btn-warpper">
               <el-button id="btn6" @click="checked('btn6')" :icon="Document">文档</el-button>
            </div>

         </div>
         <span class="aside-group-name">传输</span>
         <div class="aside-btn-group">
            <div class="aside-btn-warpper">
               <el-button id="btn7" @click="checked('btn7')" :icon="Upload">上传</el-button>
            </div>
         </div>
      </div>
      <div class="fm-container fm-container-right">
         <div id="fm-header">
            <div id="header-topbar">
               <el-breadcrumb :separator-icon="ArrowRight">
                  <el-breadcrumb-item v-for="item in routeStack" @click="toNetPath(item)">{{item.name}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div id="header-user">
               <el-avatar :size="50" />

            </div>
            <div id="header-username">
               <span> {{ user.getUsername() }}</span>
            </div>

            <div id="header-msg">
               消息
            </div>
            <div id="header-search">
               <el-input v-model="searchKey" placeholder="搜索我的文件" :prefix-icon="Search" />

            </div>
         </div>
         <div id="fm-body">

            <ShowDataOnTable data="hhh" />

         </div>
      </div>

   </div>

</template>
<script lang="ts" setup>
import { Share, Folder, VideoCamera, Headset, Picture, Document, Upload, Search,ArrowRight } from '@element-plus/icons-vue'
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'  //变量声明
import { useUserStore } from '@/stores/useUserStore'
import { useRouteStore } from "@/stores/useRouteStore";


definePageMeta({
   middleware: ["auth"]
})

const routeStack = useRouteStore().routeStack




const { proxy } = getCurrentInstance()  // 钩子函数中的this
const user = useUserStore().user



if(typeof useCookie('user').value != 'undefined')
   user.parse(useCookie('user').value)




let searchKey = ref('')

function checked(btnId: string) {
   const btn = document.getElementById(btnId)
   btn.setAttribute('style', 'background-color: #fff;color: #0F62FE')
   for (let i = 1; i <= 7; i++) {
      if ('btn' + i != btnId) {
         const tmpBtn = document.getElementById('btn' + i)
         tmpBtn.setAttribute('style', 'background-color: #F4F4F7;color: black')
      }
   }
}



function toNetPath(routeItem: any){
   useRouteStore().to(routeItem)
}

onMounted(() => {
   const myFileRef: any = proxy.$refs.btn1
   const myFile = myFileRef.ref
   myFile.setAttribute('style', 'background-color: #fff;color: #0F62FE');
})


</script>
<style lang="less" scoped>
@import url('../assets/styles/values.less');


/*
   flex垂直居中
*/

@flexAlignItemCenter: {
   display: flex;
   align-items: center;
}

/*
   flex水平垂直居中
*/
@flexCenter: {
   @flexAlignItemCenter();
   justify-self: center;
}

.fm-container {
   height: 100vh;
   width: 100vw;
   display: flex;
   background-color: @bgColor;
}

.fm-container-right {
   flex-direction: column;
}

#fm-aside {
   width: 150px;
   height: 100vh;
   padding-left: 20px;
   padding-right: 20px;

}

#fm-header {
   @flexAlignItemCenter();
   height: 70px;
   width: 100%;
}

#header-topbar {
   @flexAlignItemCenter();
   height: 70px;
   width: 60vw;
}

#header-user {
   @flexCenter();
   height: 70px;
   width: 4vw;
}

#header-username {
   @flexAlignItemCenter();
   height: 70px;
   width: 4vw;
}

#header-msg {
   @flexCenter();
   height: 70px;
   width: 4vw;
}

#header-search {
   @flexCenter();
   height: 70px;

   & :deep(.el-input__wrapper) {
      border-radius: 15px;
      width: 14vw;
   }
}

#fm-body {
   width: 100vw;
   height: 90%;
   background-color: #fff;
   border-radius: 10px;
   display: flex;

}

.aside-btn-warpper {
   @flexCenter();
   height: 40px;

   & :deep(.el-button) {
      background-color: #F4F4F7;
      justify-content: flex-start;
      width: 130px;
      color: black;
      padding: 10px;
      border: 0px;
   }
}

.aside-group-name {
   width: 130px;
   text-align: left;
   padding: 5px;
   color: #606266;
   font-size: small;
   font-weight: 500;
}

.aside-btn-group {
   display: flex;
   flex-direction: column;
}
</style>