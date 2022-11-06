export class UserFile {
   fileName: string;
   fileMd5: string;
   uploadProgress: string;
   isExistOnServer: number;

   constructor(fileName?:string,fileMd5?:string,uploadProgress?:string,isExistOnServer?:number){
      this.fileName = fileName
      this.fileMd5 = fileMd5
      this.uploadProgress = uploadProgress
      this.isExistOnServer = isExistOnServer
   }
}