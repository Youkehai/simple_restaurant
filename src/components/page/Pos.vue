<template>
  <div class="pos">
    <el-row>
      <el-col :span='7' class="pos_order" id="order_list">
        <el-tabs style="padding-left:10px;">
            <el-tab-pane label="点餐">
              <el-table :data="tableData" border style="width:100%;">
                <el-table-column prop="shopName" label="商品名称"> </el-table-column>
                <el-table-column prop="num" label="数量"> </el-table-column>
                <el-table-column prop="sumPrice" label="金额"> </el-table-column>
                <el-table-column label="操作" width="100" fixed='right'>
                  <template slot-scope='scope'>
                      <el-button type="text" size="small" @click="addOrderList(scope.row)">增加</el-button>
                      <el-button type="text" size="small" @click="delGoods(scope)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="total">
                <small>数量:</small>{{ totalCount }}<small>金额:</small>{{ totalMoney }}
              </div>
              <el-input type="textarea" v-model="order.tips" placeholder="请输入点餐备注"></el-input>
              <div class="pos_btn">
                <el-button type="danger" @click="delAllGoods()">删除</el-button>
                <el-button type="success" @click="checkOut()">结账</el-button>
              </div>
            </el-tab-pane>
        </el-tabs>
      </el-col>
        <el-col :span="17">
          <div class="often_goodsList">
            <div class="often_title">商品列表</div>
          </div>
          <div class="goodsType">
            <el-tabs style="padding-left:10px;" v-model="page.typeId" @tab-click="handleClick">
              <el-tab-pane v-for="item in typeList" :key="item.id" :label="item.name" :name="item.id">

                <div>
                  <el-row v-if="shopList.length>0">
                    <el-col :span="6"  v-for="goods in shopList" :key="goods.id" :offset="1" style="margin-top:10px;" >
                      <el-card>
                        <div slot="header" class="clearfix" >
                          <span>{{goods.name}}</span>
                          <span :class="goods.isDiscounted=='0'?'text-line':''"
                          style="float: right; padding: 3px 0;color: palevioletred;">￥{{goods.price}}</span>
                          <span style="float: right; padding: 3px 0;color: lightgreen" v-if="goods.isDiscounted=='0'">{{goods.price*(goods.discounted/10)}}</span>
                        </div>

                        <div>
                       <el-avatar shape="square" :size="100" fit="fill" :src="goods.images" @click.native="lookImg(goods.images)"></el-avatar>
                       <el-button style="float: right;" icon="el-icon-plus" circle type="success" @click="addOrderList(goods)"></el-button>
                       <p style="color: green;" v-if="goods.isDiscounted=='0'">正在打{{goods.discounted}}折中</p>
                       <p @click="showComment(goods.id)"><i class="el-icon-chat-dot-round" style="margin-top:-30px" >{{goods.commentNum}}条评论</i></p>
                        </div>
                      </el-card>
                    </el-col>
                  </el-row>
                  <el-row v-else>
                  <el-col    style="margin-top:10px;" >
                    <el-card>
                      暂无此类型的菜品
                    </el-card>
                  </el-col>
                  </el-row>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog :visible.sync="dialogComment">
      <el-row :gutter="20">
        <el-col :span="10">
        <el-input  placeholder="请输入你的评论"  v-model="shopComment.comment">
        <el-button @click="submitComment" slot="append">提交</el-button>
        </el-input>
        </el-col>
      </el-row>
        <el-alert
        v-if="commentList.length>0"
        v-for="(item,index) in commentList"
        :key="item.id"
        :closable="false"
          :title="item.createName+' '+item.createDate"
          type="success"
          :description="item.comment">
        </el-alert>
         <el-link type="primary" @click="showMore()" v-if="page1.size<page1.total">查看更多</el-link>
         <el-alert
         :closable="false"
         v-if="commentList.length==0"
           type="success"
           description="暂无评论">
         </el-alert>
    </el-dialog>

    <el-card class="box-card" style="position: fixed;top:50%;right:20px">
      <div slot="header" class="clearfix">
        <span>实时下单排行榜</span>
      </div>
      <div v-for="(o,index) in orderList" :key="o.id" class="text item">
        <tr>
        <el-avatar :src="o.images"></el-avatar>
        <span style="color:skyblue;float: right;margin:10px">{{o.name}}
        <span style="color: forestgreen;margin-left:10px">{{o.buyNum}}</span>
        <i class="el-icon-star-on" style="color: red;font-size:20px" v-if="index==0"></i>
        </span>

        </tr>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "pos",
  data() {
    return {
      shopComment:{
        comment:'',
        shopId:'',
      },
      tableData: [],
      typeList:[],
      shopList:[],
      totalMoney: 0,
      totalCount: 0,
      dialogComment:false,
      order:{
        id:'',
        tips:''
      },
      page:{
        size:100,
        current:1,
        total:0,
        typeId:''
      },
      page1:{
        size:10,
        current:1,
        status:0,
        total:0,
        shopId:''
      },
      commentList:[],
     dialogImageUrl:'',
     dialogVisible:false,
     insertOrder:true,
     orderList:[]
    };
  },
  //  进行高度的计算
  mounted: function() {
    var orderHeight = document.body.clientHeight;
    document.getElementById("order_list").style.height = orderHeight + "px";
  },
  // 创建时调用接口获取数据
  created: function() {
    this.getTypeList()
    this.getCarList();
    this.getShopOrder()
  },
  // 方法判断列表状态
  methods: {
    getShopOrder(){//获取商品排行榜
      let that=this
      y.get('/api/jwt/shop/shopOrder',{},data=>{
        if(data &&data.success){
          var len=data.data.length
          var list=data.data
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
          that.orderList=list
        }else{
          that.orderList=[]
        }
      })
    },
    showComment(id){//展示评论
      let that=this;
      if(id){
        this.page1.shopId=id
        this.shopComment.shopId=id
      }
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
    submitComment(){
      let that=this
      y.confirm("提示","确定要提交此评论吗?",function(){
        var shopComment={
          shopId:that.page1.shopId,
          comment:that.shopComment.comment
        }
        y.post('/api/jwt/comment/comment',shopComment,data=>{
          if(data && data.success){
            y.success("评论提交成功,待管理员审核通过后可查看")
            that.shopComment.comment=""
            that.showComment()
          }else{
            y.error(data.message)
          }
        })
      })
    },
    showMore(){//展示更多评论
        this.page1.size+=10
        this.showComment()
    },
    getCarList(){//查询是否有购物车订单数据
      let that=this;
      y.get('/api/jwt/order/myOrder',{},data=>{
        if(data && data.success){
          that.tableData=data.data.itemList
          that.order.id=data.data.id
          that.getAllMoney("123")//传入参数计算总价格，但是不会请求后台接口
          that.insertOrder=false
        }else{
           that.tableData=[]
          that.insertOrder=true
        }
      })
    },
    lookImg(url){
      this.dialogImageUrl=url
      this.dialogVisible=true
    },
    //获取类型
    getTypeList(){
      let that=this;
        y.get('/api/jwt/shop/shopType',{},function(data){
          if(data && data.success){
            that.typeList=data.data
            that.page.typeId=that.typeList[0].id
            that.getShopList()
          }else{
            that.typeList=[]
          }
        })
    },
    handleClick(tab, event){
      this.page.typeId=tab.paneName
      this.getShopList()
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
           that.shopList=list
          that.page.total=data.data.total
        }else{
          that.shopList=[]
          that.page.total=0
        }
      })
    },
    // 添加和计算商品价格
    addOrderList(goods) {
      //判断是否打折
      var price=0
      console.log(goods)
      if(goods.price){//如果是从右边点击加号新增，那么直接取价格
        price=goods.price
      }else{//如果不是，那么将总价放入价格，计算出单价
        price=Number(goods.sumPrice/goods.num)
      }
      if(goods.isDiscounted && goods.isDiscounted==0){
        price=goods.price*(goods.discounted/10)
      }
      // 商品是否已经存在于订单列表中
      let isHave = false;
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].shopId == goods.id || this.tableData[i].shopId == goods.shopId) {
          isHave = true;
        }
      }
      if (isHave) {
        // 改变列表中商品数量
        let arr = this.tableData.filter(o => o.shopId == goods.id || o.shopId == goods.shopId);
        arr[0].num++;
        arr[0].sumPrice=Number(arr[0].sumPrice)+Number(price);
      } else {
        let newGoods = {
          shopId: goods.id,
          shopName: goods.name,
          sumPrice: price,
          num: 1
        };
        this.tableData.push(newGoods);
      }
      this.getAllMoney();
    },
    // 删除单个商品
    delGoods(goods) {
    //  this.tableData = this.tableData.filter(o => o.shopId == goods.shopId);
      this.tableData.splice(goods.$index,1)
      this.getAllMoney();
    },
    // 全部删除商品
    delAllGoods() {
      this.tableData = [];
      this.totalMoney = 0;
      this.totalCount = 0;
    },
    // 数量和价格的汇总计算
    getAllMoney(a) {
       let that=this
      this.totalMoney = 0;
      this.totalCount = 0;
      if (this.tableData) {
        this.tableData.forEach(element => {
          this.totalCount += element.num;
          this.totalMoney = this.totalMoney + Number(element.sumPrice)  ;
        });
         if(!a){//如果传递了a参数，那么不请求后台接口，只计算价格
           //添加新订单至购物车
           if(this.insertOrder){//如果没有购物车数据
             var order={
               num:this.totalCount,
               sumPrice:this.totalMoney,
               tips:this.order.tips,
               itemList:this.tableData
             }
             y.post("/api/jwt/order/order",order,data=>{
               if(data && data.success){
                   that.insertOrder=false
                   that.order.id=data.data.id
               }else{
                   y.error(data.message)
               }
             })
           }else{//如果有 请求修改的接口
             var order={
               id:this.order.id,
               num:this.totalCount,
               sumPrice:this.totalMoney,
               tips:this.order.tips,
               itemList:this.tableData
             }
             y.put("/api/jwt/order/order?date="+Math.ceil(Math.random()*10),order,data=>{
               if(data && data.success){
                   that.insertOrder=false
               }else{
                   y.error(data.message)
               }
             })
           }
         }
      }
    },
    // 模拟结账
    checkOut() {
      if (this.tableData.length>0) {
        let that=this
        y.confirm("提示","确认要结账吗？一共"+this.totalMoney+"元",function(){
            y.put('/api/jwt/order/submitOrder?orderId='+that.order.id+"&tips="+that.order.tips,{},data=>{
              if(data && data.success){
                y.success("结算成功")
                that.tableData = [];
                that.totalMoney = 0;
                that.totalCount = 0;
                that.order.tips=''
                that.insertOrder=true
              }else{
                that.insertOrder=false
                y.error(data.message)
              }
            })
        })
      } else {
        y.error("请先选购商品");
      }
    }
  }
};
</script>

<style scoped>
    .text {
      font-size: 14px;
    }

    .item {
      margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }
    .clearfix {
      width: 200px
    }
.text-line{ text-decoration:line-through}
.pos_order {
  background-color: #f9fafc;
  border-right: 1px solid #c0ccda;
}
.pos_btn {
  margin-top: 20px;
}
.often_title {
  height: 20px;
  border-bottom: 1px solid #d3dce6;
  background-color: #f9fafc;
  padding: 10px;
  text-align: left;
  cursor: pointer;
}
.often_goodsList ul li {
  list-style: none;
  float: left;
  border: 1px solid #d3dce6;
  padding: 10px;
  margin: 10px;
  background-color: #ffffff;
  cursor: pointer;
}
.often_price {
  color: #63b8ff;
}
.goodsType {
  clear: both;
  height: auto;
  overflow: hidden;
  border-top: 1px solid #d3dce6;
}

.cookList li {
  list-style: none;
  width: 23%;
  border: 1px solid #e5e9f2;
  height: auot;
  overflow: hidden;
  background-color: #fff;
  padding: 2px;
  float: left;
  margin: 2px;
  cursor: pointer;
}
.cookList li span {
  display: block;
  float: left;
}
.foodImg {
  width: 40%;
}
.foodName {
  font-size: 16px;
  padding-left: 10px;
  color: brown;
}
.foodPrice {
  font-size: 16px;
  padding-left: 10px;
  padding-top: 10px;
}
.total {
  background: #ffffff;
  padding: 10px;
  border-bottom: 1px solid #d3dce6;
}
.total small {
  padding: 0 10px;
  text-align: center;
}
</style>
