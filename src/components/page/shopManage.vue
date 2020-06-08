<template>
  <div>
<el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>商品管理</span>
      <el-button style="float: right; padding: 3px 0;margin-left:5px;" @click="dialogFormVisible=true,form={},fileList=[]" type="text">新增商品</el-button>
      <el-button style="float: right; padding: 3px 0" @click="dialogTableVisible=true" type="text">商品类型</el-button>
    </div>
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane label="所有商品" name="first">

    <el-row :gutter="20">
      <el-col :span="10">
      <el-input  placeholder="请输入内容"  v-model="page.name">
      <el-button @click="getShopList()" slot="append">搜索</el-button>
      </el-input>
      </el-col>
    </el-row>
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
      width="100"
      >
      <template slot-scope="scope">
        <el-tag type="success" v-if="scope.row.status==0">上架</el-tag>
        <el-tag type="danger" v-if="scope.row.status==1">下架</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="是否打折"
      width="150"
      >
      <template slot-scope="scope">
        <el-tag type="success" v-if="scope.row.isDiscounted==0">是 打{{scope.row.discounted}}折[{{scope.row.price*(scope.row.discounted/10)}}]</el-tag>
        <el-tag type="danger" v-if="scope.row.isDiscounted==1">否</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="名称"
      width="180">
    </el-table-column>
    <el-table-column
      label="图片"
       width="80"
      >
      <template slot-scope="scope">
        <el-avatar :src="scope.row.images"></el-avatar>
      </template>
    </el-table-column>
    <el-table-column
      prop="price"
      label="价格"
      width="80"
      >
    </el-table-column>
    <el-table-column
      prop="typeName"
      label="类型"
      >
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
            <el-button size="mini" type="primary" v-if="scope.row.status==1" @click="updateStatus(scope.row.id,0)">上架</el-button>
            <el-button size="mini"type="danger" v-if="scope.row.status==0"  @click="updateStatus(scope.row.id,1)">下架</el-button>
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
  </el-tab-pane>
    <el-tab-pane label="所有评论" name="second">
      <el-card  v-if="commentList.length>0"
        v-for="(item,index) in commentList" :key="item.id">
      <el-alert
        :key="item.id"
        :closable="false"
          :title="item.createName+' '+item.createDate"
          :type="item.status==0?'success':'info'"
          :description="item.comment">
        </el-alert>
        <el-button type="danger" style="float: right;" @click="deleteComment(item.id)">删除</el-button>
        <el-button style="float: right;" v-if="item.status==1" @click="updateComment(item.id,0)">展示</el-button>
        <el-button style="float: right;" v-if="item.status==0" @click="updateComment(item.id,1)">不展示</el-button>
        </el-card>
         <el-link type="primary" @click="showMore()" v-if="page1.size<page1.total">查看更多</el-link>
         <el-alert
         :closable="false"
         v-if="commentList.length==0"
           type="success"
           description="暂无评论">
         </el-alert>
    </el-tab-pane>
  </el-tabs>
  </el-card>
  <el-dialog title="商品信息" :visible.sync="dialogFormVisible">
    <el-form :model="form" label-width="80px" :rules="rules" ref="ruleForm">
       <el-form-item label="商品图片" >
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
      <el-form-item label="商品类型" prop="typeId">
        <el-select v-model="form.typeId" placeholder="请选择商品类型" style="width:500px">
          <el-option v-for="(item,index) in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input v-model="form.price"  type="number" oninput ="value=value.replace(/[^\d.]/g,'')" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="是否打折">
        <el-switch
          v-model="form.open"
          active-text="是"
          @change="changeValue"
          inactive-text="否">
        </el-switch>
      </el-form-item>
      <el-form-item v-if="form.open" label="打折力度">
        <el-input v-model="form.discounted" autocomplete="off" type="number" oninput ="value=value.replace(/[^\d.]/g,'')"></el-input>
      </el-form-item>
      <el-form-item label="商品说明" >
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
  <el-dialog title="商品类型" :visible.sync="dialogTableVisible">
     <el-button style="float: right; padding: 3px 0" @click="dialogFormVisible1=true,typeForm={}" type="text">新增</el-button>
      <el-table
        :data="typeList"
        border
        style="width: 100%"
        >
        <el-table-column
          type="index"
          label="序号"
          sortable
          >
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          >
        </el-table-column>
        <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="editShopType(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteShopType(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
  </el-dialog>
  <el-dialog :visible.sync="dialogFormVisible1">
     <el-input v-model="typeForm.name" autocomplete="off"></el-input>
     <div slot="footer" class="dialog-footer">
       <el-button @click="dialogFormVisible1 = false">取 消</el-button>
       <el-button type="primary" @click="sureShopType()">确 定</el-button>
     </div>
  </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeName:'first',
        dialogFormVisible1:false,
        typeList:[],
        rules: {
        name: [
          { required: true, message: '请输商品名称', trigger: 'blur' }
        ],
        typeId: [
          { required: true, message: '请选择商品类型', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        },
        headers:{
          Authorization:y.getVal("jwt")
        },
        dialogTableVisible:false,
        apiPath:y.v.apiPath+'/api/jwt/upload/upload',
        dialogFormVisible:false,
        dialogVisible:false,
        form:{
          name:'',
          typeId:'',
          open:false,
          isDiscounted:false,
          price:0,
          images:'',
          tips:''
        },
        typeForm:{
          name:''
        },
        dialogImageUrl:'',
        imageList:[],
        tableData: [],
        fileList:[],
        page:{
          size:10,
          current:1,
          total:0,
          name:''
        },
        page1:{
          size:10,
          current:1,
          total:0,
        },
        commentList:[]
      }
    },
    methods: {
      deleteComment(id){//删除评论
        let that=this
        y.confirm("提示","确定要删除此评论吗？",function(){
          y.put('/api/jwt/comment/comment/'+id,{},data=>{
            if(data && data.success){
              y.success("删除成功")
              that.showComment()
            }else{
              y.error(data.message)
            }
          })
        })
      },
      updateComment(id,status){//修改评论状态
        var comment={
          id:id,
          status:status
        }
        let that=this
        y.put('/api/jwt/comment/comment',comment,data=>{
          if(data && data.success){
            y.success("修改成功")
            that.showComment()
          }else{
            y.error(data.message)
          }
        })
      },
      showComment(){//展示评论
        let that=this;
        y.get('/api/jwt/comment/comment',this.page1,data=>{
              that.dialogComment=true
            if(data && data.success){
              that.commentList=data.data.records
              that.page1.total=data.data.total
            }else{
              that.commentList=[]
              that.page1.total=0
            }
        })
      },
      showMore(){//展示更多评论
          this.page1.size+=10
          this.showComment()
      },
        handleSizeChange(val) {
          this.page.size=val
          this.getShopList()
          },
        handleCurrentChange(val) {
          this.page.current=val
          this.getShopList()
        },
      changeValue(value){
        this.form.open=value
        this.$forceUpdate()
      },
      sureShopType(){
        var that=this;
        if(that.typeForm.id){
         // y.confirm("提示","确定要修改此类型吗",function(){
            y.put('/api/jwt/shop/shopType',that.typeForm,data=>{
              if(data && data.success){
                y.success("操作成功")
                that.getTypeList()
                that.dialogFormVisible1=false
              }else{
                y.error(data.message)
              }
            })
         // })
        }else{
          //y.confirm("提示","确定要新增此类型吗",function(){
            y.post('/api/jwt/shop/shopType',that.typeForm,data=>{
              if(data && data.success){
                y.success("操作成功")
                that.getTypeList()
                that.dialogFormVisible1=false
              }else{
                y.error(data.message)
              }
            })
          //})
        }
      },
      deleteShopType(id){
        var that=this;
        //y.confirm("提示","确定要删除此类型吗",function(){
          y.delete('/api/jwt/shop/shopType/'+id,{},data=>{
            if(data && data.success){
              y.success("操作成功")
              that.getTypeList()
            }else{
              y.error(data.message)
            }
          })
       // })
      },
      editShopType(data){
        this.typeForm=JSON.parse(JSON.stringify(data))
        this.dialogFormVisible1=true
      },
      editShop(data){
        this.fileList=[]
        this.imageList=[]
        this.form=data
        if(this.form.isDiscounted=='0'){
          this.form.open=true
        }else{
          this.form.open=false
        }
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
        y.confirm("提示","确定要删除此商品吗",function(){
          y.delete('/api/jwt/shop/shop/'+id,{},data=>{
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
        var shop={
          id:id,
          status:status
        }
        y.confirm("提示","修改商品状态",function(){
          y.put('/api/jwt/shop/shop',shop,data=>{
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
              if(this.form.open){
                this.form.isDiscounted='0'
              }else{
                this.form.isDiscounted='1'
              }
              if(this.form.id){
                y.put('/api/jwt/shop/shop',this.form,function(data){
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
                y.post('/api/jwt/shop/shop',this.form,function(data){
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
      getShopList(){//查询商品列表数据
      let that=this;
        y.get('/api/jwt/shop/shop',this.page,function(data){
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
      getTypeList(){
        let that=this;
          y.get('/api/jwt/shop/shopType',{},function(data){
            if(data && data.success){
              that.typeList=data.data
            }else{
              that.typeList=[]
            }
          })
      }
    },
    created(){
      this.getShopList()
      this.getTypeList();
      this.showComment();
    }
  }
</script>
