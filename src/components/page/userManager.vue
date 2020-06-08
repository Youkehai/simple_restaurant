<template>
  <div>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>会员管理</span>
    </div>
 <el-row :gutter="20">
      <el-col :span="10">
      <el-input  placeholder="请输入内容"  v-model="page.name">
      <el-button @click="getTableData()" slot="append">搜索</el-button>
      </el-input>
      </el-col>
    </el-row>
  <el-table
    :data="tableData"
    style="width: 100%"
    border
    >
    <el-table-column
      type="index"
      label="序号"
      width="50">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      >
    </el-table-column>
    <el-table-column
      prop="username"
      label="账号"
      >
    </el-table-column>
    <el-table-column
      prop="orderNum"
      label="点餐次数"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      label="性别"
      >
      <template slot-scope="scope">
        <el-tag type="danger" v-if="scope.row.sex==0">女</el-tag>
        <el-tag type="primary" v-if="scope.row.sex==1">男</el-tag>
        <el-tag type="info" v-if="scope.row.sex==2">未知</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="createDate"
      label="注册时间"
      >
    </el-table-column>
  </el-table>
  </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        page:{
          current:1,
          size:10,
          total:0,
          name:''
        }
      }
    },
    methods: {
      getTableData(){
        let that=this
        y.get('/api/jwt/user/users',this.page,data=>{
          if(data && data.success){
            that.tableData=data.data.records
            that.page.total=data.data.total
          }else{
            that.tableData=[]
            that.page.total=0
          }
        })
      }
    },
    created(){
      this.getTableData()
    }
  }
</script>
