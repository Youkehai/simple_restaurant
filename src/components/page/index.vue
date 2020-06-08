<template>
  <el-card>
     <div slot="header" >
        <span>店家资讯</span>
      </div>
  <el-row>
    <el-col :span="8" v-for="(o, index) in tableData" :key="o.id" :offset="1" style="margin-top:10px;">
      <el-card :body-style="{ padding: '0px' }">
          <el-carousel :interval="5000" arrow="always">
            <el-carousel-item v-for="item in o.imagesList" :key="item">
              <img :src="item">
            </el-carousel-item>
          </el-carousel>
        <div >
          <span>{{o.title}}</span>
          <div class="bottom clearfix">
            <time class="time">{{o.tips}}</time>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        page:{
          size:100,
          current:1,
          status:0
        },
        tableData:[]
      };
    },
    methods:{
      getIndexNews(){
        let that=this;
          y.get('/api/jwt/message/message',this.page,function(data){
            if(data && data.success){
              var len=data.data.records.length
              var list=data.data.records
              for(var i=0;i<len;i++){
                list[i].imagesList=[]
                if(list[i].images.indexOf(",")!=-1){//如果有多张图片 那么只取一张
                    var img=list[i].images.split(",")[0]
                    list[i].imagesList=list[i].images.split(",")
                    list[i].images=img
                }else{
                   var img=list[i].images
                  list[i].images=img
                  list[i].imagesList.push(img)
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
      this.getIndexNews()
    }
  }
</script>

<style>
    .time {
      font-size: 13px;
      color: #999;
    }

    .bottom {
      margin-top: 13px;
      line-height: 12px;
    }

    .button {
      padding: 0;
      float: right;
    }

    .image {
      width: 100%;
      display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }
</style>
