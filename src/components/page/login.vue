<template>
  <div class="login-container">
    <el-form ref="loginForm" v-if="formType=='login'" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">餐饮系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <i class="el-icon-user-solid"></i>
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <i class="el-icon-lock"></i>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <i :class="passwordType === 'password' ? 'el-icon-view' : 'el-icon-view'"></i>
          </span>
        </el-form-item>
      </el-tooltip>
     <div style="position:relative;float: left;">
         <div class="tips">
          <el-button type='text' @click="formType='regist'">注册</el-button>
        </div>
      </div>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>

    <el-form ref="registForm" v-if="formType=='regist'" :model="registForm" :rules="registRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">餐饮系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <i class="el-icon-user-solid"></i>
        </span>
        <el-input
          ref="name"
          v-model="registForm.name"
          placeholder="请输入昵称"
          name="name"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <i class="el-icon-lock"></i>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="registForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleRegist"
          />
          <span class="show-pwd" @click="showPwd">
            <i :class="passwordType === 'password' ? 'el-icon-view' : 'el-icon-view'"></i>
          </span>
        </el-form-item>
      </el-tooltip>
     <div style="position:relative;float: left;">
         <div class="tips">
          <el-button type='text' @click="formType='login'">登录</el-button>
        </div>
      </div>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegist">注册</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入登录账号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位数'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '1000',
        password: '123456'
      },
      registForm:{
        name:'',
        password:'',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      registRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入名称', }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      formType:'login',
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.$notify({
        title: '账号',
        dangerouslyUseHTMLString: true,
        message: '管理员账号:1000 <br>普通用户:1005 <br>密码都是123456',
         // showClose: false,
         duration: 0
      });
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  //管理员账号密码：1000 12345678
  methods: {
    handleRegist(){
      var that=this;
    this.$refs.registForm.validate(valid => {
        if (valid) {
          var user={
            name:this.registForm.name,
            password:this.registForm.password
          }
          y.post('/api/open/user/user',user,function(data){
            if(data && data.success){
              y.success("注册成功，正在登录")
               that.$notify({
                  title: '提示',
                   type: 'success',
                  message: '您的登录账号为'+data.data.username,
                  duration: 0
                });
              var loginUser={
                username:data.data.username,
                password:that.registForm.password
              }
              y.post('/api/open/user/login',loginUser,function(data1){
                if(data1 &&data1.success){
                  y.setVal("jwt",data1.attributes.token)
                  y.setVal("userInfo",JSON.stringify(data1.data))//放入用户信息
                  y.setVal("role",data1.data.role)//设置用户角色值
                  if(data1.data.role=='admin'){
                    y.go('/')//如果是管理员跳转首页
                  }else{
                    y.go('/index')
                  }
                  y.success("登录成功")
                }else{
                  that.loading = false
                  y.error("账号或密码不正确")
                }
              })
            }else{
              y.error(data.message)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      var that=this;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          //请求登录接口并跳转
          var loginUser={
            username:this.loginForm.username,
            password:this.loginForm.password
          }
          y.post('/api/open/user/login',loginUser,function(data){
            if(data &&data.success){
              y.setVal("jwt",data.attributes.token)
              y.setVal("userInfo",JSON.stringify(data.data))//放入用户信息
              y.setVal("role",data.data.role)//设置用户角色值
              y.success("登录成功")
              if(data.data.role=='admin'){
                y.go('/')//如果是管理员跳转首页
              }else{
                y.go('/index')
              }
            }else{
              that.loading = false
              y.error("账号或密码不正确")
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>

$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
