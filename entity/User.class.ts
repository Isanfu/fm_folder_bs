/**
 * 用户实体类
 */
export class User {
   private id: string;
   private username: string;
   private password: string;
   private token: string;
   private authority: string[];
   private role: string[];
   private avatar: string;
   private ip: string;
   private modifyTime: string;
   private createTime: string;
   constructor();
   constructor(id: string, username: string, password: string, token: string, authority: string[], role: string[], avatar: string, ip: string, modifyTime: string, createTime: string);
   constructor(id?: string, username?: string, password?: string,
      token?: string, authority?: string[], role?: string[], avatar?: string, ip?: string, modifyTime?: string,
      createTime?: string) {
      this.id = id
      this.username = username
      this.password = password
      this.token = token
      this.avatar = avatar
      this.ip = ip
      this.modifyTime = modifyTime
      this.createTime = createTime
      this.authority = authority
      this.role = role
   }
   public getId(): string {
      return this.id
   }
   public setId(id: string) {
      this.id = id;
   }

   public getUsername(): string {
      return this.username
   }
   public setUsername(username: string) {
      this.username = username;
   }

   public getPassword(): string {
      return this.password
   }
   public setPassword(password: string) {
      this.password = password;
   }

   public getToken(): string {
      return this.token
   }
   public setToken(token: string) {
      this.token = token;
   }

   public getAvatar(): string {
      return this.avatar
   }
   public setAvatar(avatar: string) {
      this.avatar = avatar;
   }

   public getIp(): string {
      return this.ip
   }
   public setIp(ip: string) {
      this.ip = ip;
   }


   public getModifyTime(): string {
      return this.modifyTime
   }
   public setModifyTime(modifyTime: string) {
      this.modifyTime = modifyTime;
   }



   public getCreateTime(): string {
      return this.createTime
   }
   public setCreateTime(createTime: string) {
      this.createTime = createTime;
   }



   public getAuthority(): string[] {
      return this.authority
   }
   public setAuthority(authority: string[]) {
      this.authority = authority;
   }


   public getRole(): string[] {
      return this.role
   }
   public setRole(role: string[]) {
      this.role = role;
   }


   public parse(string: string): void {
      const userStr = JSON.parse(JSON.stringify(string))
      this.id = userStr.id
      this.username = userStr.username
      this.token = userStr.token
      this.avatar = userStr.avatar
      this.createTime = userStr.createTime
      this.modifyTime = userStr.modifyTime
   }




}