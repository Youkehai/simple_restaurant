<template>
    <div class="left_nav">
        <ul>
            <li @click="goPage('/')">
                <i class="iconfont icon-goumai"></i>
                <div>点餐</div>
            </li>
            <li @click="goPage('/shopManage')" v-if="roleValue=='admin'">
                <i class="iconfont icon-hanbao"></i>
                <div>商品</div>
            </li>
            <li @click="goPage('/userManager')" v-if="roleValue=='admin'">
                <i class="iconfont icon-huiyuanqia"></i>
                <div>会员</div>
            </li>
            <li @click="goPage('/message')" v-if="roleValue=='admin'">
                <i class="el-icon-chat-dot-round" style="font-size:24px"></i>
                <div>资讯</div>
            </li>
            <li @click="goPage('/charts')" v-if="roleValue=='admin'">
                <i class="iconfont icon-zuanshi"></i>
                <div>统计</div>
            </li>
            <li @click="goPage('/order')" v-if="roleValue=='user'">
                <i class="el-icon-wallet" style="font-size:24px"></i>
                <div>订单</div>
            </li>
            <li @click="goPage('/setting')">
                <i class="iconfont icon-gongnengjianyi"></i>
                <div>设置</div>
            </li>
        </ul>
    </div>
</template>


<script>
export default {
  data(){
    return{
      roleValue:'user'
    }
  },
  methods:{
    //跳转页面
      goPage(url){
          y.go(url)
      },
      getUserRole(){
        this.roleValue=y.getVal("role")
      },
  },
  created(){
    this.getUserRole()
  },
  mounted(){

  }
};
</script>

<style>
    .left_nav{
        color: #ffffff;
        font-size: 10px;
        /* position: fixed; */
        height: 100%;
        background-color: #1D8CE0;
        float: left;
        width: 5%;
    }
    .iconfont {
        font-size: 24px;
    }
    .left_nav ul {
        padding: 0px;
        margin: 0px;
    }
    .left_nav li {
        list-style: none;
        text-align: center;
        border-bottom: 1px solid #1D8CE0;
        padding: 10px;
    }
</style>
