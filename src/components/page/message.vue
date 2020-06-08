<template>
  <div>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>资讯管理</span>
      <el-button style="float: right; padding: 3px 0" @click="dialogFormVisible=true,form={},fileList=[]" type="text">新增资讯</el-button>
    </div>
  <el-table
    :data="tableData"
    border
    style="width: 100%"
    :default-sort = "{prop: 'date', order: 'descending'}"
    >
    <el-table-column
      type="index"
      label="序号"
      sortable
      width="50"
      >
    </el-table-column>
    <el-table-column
      label="状态"
      >
      <template slot-scope="scope">
        <el-tag type="success" v-if="scope.row.status==0">启用</el-tag>
        <el-tag type="danger" v-if="scope.row.status==1">停用</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="title"
      label="标题"
      width="180">
    </el-table-column>
    <el-table-column
      label="图片"
      >
      <template slot-scope="scope">
        <el-avatar :src="scope.row.images"></el-avatar>
      </template>
    </el-table-column>
    <el-table-column
      prop="tips"
      label="说明"
      >
    </el-table-column>
    <el-table-column
      prop="createDate"
      label="创建时间"
      >
    </el-table-column>
    <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="editShop(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteShop(scope.row.id)">删除</el-button>
            <el-button size="mini" type="primary" v-if="scope.row.status==1" @click="updateStatus(scope.row.id,0)">启用</el-button>
            <el-button size="mini"type="danger" v-if="scope.row.status==0"  @click="updateStatus(scope.row.id,1)">停用</el-button>
          </template>
        </el-table-column>
  </el-table>
  <el-pagination
  style="float: right;"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :page-sizes="[5,10,15,20]"
    :page-size="page.size"
    layout="sizes, prev, pager, next"
    :total="page.total">
  </el-pagination>
  </el-card>
  <el-dialog title="资讯内容" :visible.sync="dialogFormVisible">
    <el-form :model="form" label-width="80px" :rules="rules" ref="ruleForm">
       <el-form-item label="资讯图片" >
      <el-upload
        :action="apiPath"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-success="handeleSuccess"
        :headers="headers"
        :file-list="fileList"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="tips">
        <el-input v-model="form.tips" autocomplete="off" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="insertShop('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
  <el-dialog :visible.sync="dialogVisible">
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        rules: {
          name: [
            { required: true, message: '请输入标题内容', trigger: 'blur' }
          ],
          tips: [
            { required: true, message: '请输入资讯内容', trigger: 'blur' }
          ],
        },
        headers:{
          Authorization:y.getVal("jwt")
        },
        apiPath:y.v.apiPath+'/api/jwt/upload/upload',
        dialogFormVisible:false,
        dialogVisible:false,
        form:{
          title:'',
          images:'',
          tips:''
        },
        dialogImageUrl:'',
        imageList:[],
        tableData: [],
        fileList:[],
        page:{
          size:10,
          current:1,
          total:0
        }
      }
    },
    methods: {
      handleSizeChange(val) {
        this.page.size=val
        this.getShopList()
        },
      handleCurrentChange(val) {
        this.page.current=val
        this.getShopList()
      },
      editShop(data){
        this.fileList=[]
        this.imageList=[]
        this.form=data
        if(data.imagesList){
          var len=data.imagesList.split(",").length
          var list=data.imagesList.split(",")
          for(var i=0;i<len;i++){
            this.imageList.push(list[i])
            var img={
              name:'img'+i,
              url:list[i]
            }
            this.fileList.push(img)
          }
        }else{
          this.imageList.push(data.images)
          var img={
            name:data.images.replace(y.v.imgUrl,""),
            url:data.images
          }
          this.fileList.push(img)
        }
        this.dialogFormVisible=true
      },
      deleteShop(id){
        var that=this;
        y.confirm("提示","确定要删除此资讯吗",function(){
          y.delete('/api/jwt/message/message/'+id,{},data=>{
            if(data && data.success){
              y.success("操作成功")
              that.getShopList()
            }else{
              y.error(data.message)
            }
          })
        })
      },
      updateStatus(id,status){
        var that=this;
        var message={
          id:id,
          status:status
        }
        y.confirm("提示","修改资讯状态",function(){
          y.put('/api/jwt/message/message',message,data=>{
            if(data && data.success){
              y.success("操作成功")
              that.getShopList()
            }else{
              y.error(data.message)
            }
          })
        })
      },
      insertShop(formName){
        let that=this;
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.imageList.length>0){
                this.form.images=this.imageList.join(",")
              }
              if(this.form.id){
                y.put('/api/jwt/message/message',this.form,function(data){
                  if(data && data.success){
                     y.success("修改成功")
                     that.dialogFormVisible=false
                     that.getShopList()
                     that.form={}
                  }else{
                    y.error(data.message)
                  }
                })
              }else{
                y.post('/api/jwt/message/message',this.form,function(data){
                  if(data && data.success){
                     y.success("新增成功")
                     that.dialogFormVisible=false
                     that.getShopList()
                     that.form={}
                  }else{
                    y.error(data.message)
                  }
                })
              }

            } else {
              return false;
            }
          });
      },
      handeleSuccess(data, file, fileList){
        var that=this
        that.imageList=[]
        if(data && data.success){
          var len=fileList.length
          for(var i=0;i<len;i++){
            that.imageList.push(y.v.imgUrl+fileList[i].name.replace(",",""))
          }
        }else if(data && data.status==9999){
          this.$confirm('登录已过期, 请重新登录?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              y.go('/login')
            }).catch(() => {
               y.go('/login')
          })
        }else{
          y.error(data.message)
        }
      },
       handleRemove(file, fileList) {
         var len=fileList.length
         for(var i=0;i<len;i++){
           this.imageList.push(fileList[i].name)
         }
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      getShopList(){//查询列表数据
      let that=this;
        y.get('/api/jwt/message/message',this.page,function(data){
          if(data && data.success){
            var len=data.data.records.length
            var list=data.data.records
            for(var i=0;i<len;i++){
              if(list[i].images.indexOf(",")!=-1){//如果有多张图片 那么只取一张
                  var img=list[i].images.split(",")[0]
                  list[i].imagesList=list[i].images
                  list[i].images=img
              }else{
                 var img=list[i].images
                list[i].images=img
              }
            }
             that.tableData=list
            that.page.total=data.data.total
          }else{
            that.tableData=[]
            that.page.total=0
          }
        })
      },
    },
    created(){
      this.getShopList()
    }
  }
</script>
