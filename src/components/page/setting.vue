<template>
  <div>
    <el-row>
      <el-col :span="12">
        <!-- 个人信息 -->
        <el-card>
         <div slot="header" class="clearfix">
              <span>个人信息</span>
        </div>
        <div v-if="formType=='look'">
            <div>
              <el-avatar :src="userInfo.avatar"></el-avatar>
            </div>
            {{userInfo.name}}
            <br>
            登录账号:{{userInfo.username}}
             <br>
            <span v-if="userInfo.sex==0" style="color: palevioletred;">女</span>
            <span v-if="userInfo.sex==1" style="color: skyblue;">男</span>
            <span v-if="userInfo.sex==2" style="color:grey">未知</span>
            <div style="margin-top:50px;">
              <el-button type="danger" @click="logout()">注销登录</el-button>
              <el-button type="primary" @click="formType='update'">修改信息</el-button>
            </div>
           </div>
           <div v-if="formType=='update'">
              <el-input v-model="userInfo.name"></el-input>
               <br>
               <br><br>
                 <el-radio v-model="userInfo.sex" label="1">男</el-radio>
                 <el-radio v-model="userInfo.sex" label="0">女</el-radio>
                 <el-radio v-model="userInfo.sex" label="2">未知</el-radio>
               <div style="margin-top:50px;">
                 <el-button type="default" @click="formType='look'">返回</el-button>
                 <el-button type="primary" @click="updateInfo">保存</el-button>
               </div>
              </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <!-- 修改密码 -->
        <el-card>
          <div slot="header" class="clearfix">
                <span>修改密码</span>
          </div>
          <el-form  label-width="80px" :model="formLabelAlign" :rules="rules" ref="ruleForm" >
            <el-form-item label="原密码" prop="oldPassword">
              <el-input v-model="formLabelAlign.oldPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="formLabelAlign.newPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input v-model="formLabelAlign.confirmPassword" type="password"></el-input>
            </el-form-item>
             <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
              </el-form-item>
          </el-form>
        </el-card>
     </el-col>
    </el-row>

  </div>
</template>

<script>

  export default{

    data(){
      var validatePass2 = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== this.formLabelAlign.newPassword) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
          };
      return {
        formType:'look',
        input:'',
        userInfo:{
        },
        formLabelAlign: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ]
        }
      }
    },
    created(){
      this.userInfo=JSON.parse(y.getVal("userInfo"))
      this.userInfo.avatar="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
    },
    methods:{
      updateInfo(){
        var that=this
        if(!this.userInfo.name){
          y.error("请输入昵称")
          return false
        }
        y.put('/api/jwt/user/userInfo',this.userInfo,function(data){
          if(data && data.success){
            y.success("修改成功")
            y.setVal("userInfo",JSON.stringify(data.data))
            that.formType='look'
          }else{
            y.error(data.message)
          }
        })
      },
      submitForm(formName) {
        let that=this;
          this.$refs[formName].validate((valid) => {
            if (valid) {
              var user={
                id:this.userInfo.id,
                password:this.formLabelAlign.newPassword,
                oldPassword:this.formLabelAlign.oldPassword
              }
              y.put('/api/jwt/user/password',user,function(data){
                if(data && data.success){
                   y.success("修改成功")
                   that.formLabelAlign={}
                }else{
                  y.error(data.message)
                }
              })
            } else {
              return false;
            }
          });
        },
        logout(){
          y.confirm("注销登录","确定要注销登录吗？",function(){
              localStorage.clear()
              y.go('/login')
          })
        },
    }
  }
</script>

<style>
</style>
