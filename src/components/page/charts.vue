<template>
  <div>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>统计</span>
    </div>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="所有订单" name="first">
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          >
          <el-table-column
            type="index"
            label="序号"
            width="50"
            >
          </el-table-column>
          <el-table-column
            prop="orderNum"
            label="流水号"
            width="90"
            sortable
            >
          </el-table-column>
          <el-table-column
            label="状态"
            width="100"
            >
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status==0">已完成</el-tag>
              <el-tag type="danger" v-if="scope.row.status==1">未结算</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="sumPrice"
            label="总金额"
            sortable
            >
          </el-table-column>
          <el-table-column
            prop="num"
            label="点餐数量">
          </el-table-column>
          <el-table-column
            prop="tips"
            label="备注">
          </el-table-column>
          <el-table-column
            prop="createName"
            label="点餐者">
          </el-table-column>
          <el-table-column
            prop="createDate"
            label="结算日期">
          </el-table-column>
          <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini"type="primary"  @click="getItem(scope.row.id)">详情</el-button>
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
      <el-tab-pane label="报表查询" name="second">
        <ve-line :data="chartData" ref="charts" :settings="chartSettings"></ve-line>
      </el-tab-pane>
    </el-tabs>
</el-card>
    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
      width="30%"
     >
      <el-card>
        <div slot="header" class="clearfix" >
          <span  style="padding: 3px 0;color: palevioletred;">￥{{item.sumPrice}}</span>
        </div>
      <p style="margin:5px">点餐人:{{item.createName}}</p>
      <p style="margin:5px">备注:{{item.tips}}</p>
      <p style="margin:5px">点餐时间{{item.createDate}}</p>
      <el-table :data="item.itemList" border style="width:100%;">
        <el-table-column prop="shopName" label="商品名称"> </el-table-column>
        <el-table-column prop="num" label="数量"> </el-table-column>
        <el-table-column prop="sumPrice" label="金额"> </el-table-column>
      </el-table>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      this.chartSettings = {
            labelMap: {
              'createDate': '日期',
              'sumPrice': '下单总金额',
              'num':'下单量'
            },
            legendName:{
              'createDate': '日期',
              'sumPrice': '下单总金额',
              'num':'下单量'
            }
          }
      return {
        chartData: {
          columns: ['createDate', 'sumPrice', 'num'],
          rows: []
        },
        dialogVisible:false,
        activeName: 'first',
        tableData: [],
        page:{
          size:10,
          current:1,
          total:0,
          name:''
        },
        item:{}
      }
    },
    methods: {
      getChartData(){
        let that=this
        y.get('/api/jwt/order/orderChart',{},data=>{
          if(data && data.success){
            var len=data.data.length
            for(var i=0;i<len;i++){
              data.data[i].createDate=data.data[i].createDate.substring(0,10)
            }
            that.chartData.rows=data.data
          }else{
            that.chartData.rows=[]
          }
        })
      },
      getItem(id){
        let that=this;
        y.get('/api/jwt/order/order/'+id,{},data=>{
          if(data && data.success){
            that.item=data.data
            that.dialogVisible=true
          }else{
            that.item={}
          }
        })
      },
      handleSizeChange(val) {
        this.page.size=val
        this.getTableData()
        },
      handleCurrentChange(val) {
        this.page.current=val
        this.getTableData()
      },
      getTableData(){
        let that=this;
        y.get('/api/jwt/order/order',this.page,data=>{
          if(data && data.success){
            that.tableData=data.data.records
            that.page.total=data.data.total
          }else{
            that.tableData=[]
            that.page.total=0
          }
        })
      },
       handleClick(tab, event) {
         if(tab.paneName=='second'){
          this.$nextTick(_ => {
              this.$refs.charts.echarts.resize()
          })
         }
      }
    },
    created(){
      this.getTableData()
      this.getChartData();
    }
  }
</script>
