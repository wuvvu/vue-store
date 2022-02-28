<template>
  <div style="height: calc(100% - 40px);width: calc(100% - 40px);background-color: #fff;padding: 20px">
    <div style="border-bottom: #dddddd 1px solid;display: flex;align-items: center; height: 30px;font-size: 18px">市场分析</div>
    <div style="margin:15px 0">
      <span> 选择分类： </span>
      <el-select v-model="category_name" placeholder="请选择需要查询的分类" size="small" @change="changeCategory">
        <el-option
            v-for="item in categoryList"
            :key="item.category_id"
            :label="item.category_name"
            :value="item.category_id"
        >
        </el-option>
      </el-select>
    </div>

    <div id="main" :style="{width: '100%', height: '700px'}"></div>
  </div>
</template>

<script>

import * as echarts from 'echarts';
export default {
  name: "Analysis",
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      category_name:1,// 分类搜索
      categoryList: "", //分类列表
      goodsNameList:[],
      goodsSalesList:[],

    }
  },
  created() {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user.userName !== "admin"){
      this.$message.error("请使用管理员账号进入！")
      this.$router.push({ path: "/" });
      this.$router.go(0);
    }else {
      this.getCategory()
      this.changeCategory()
    }
  },
  mounted () {
    this.drawLine();
  },
  methods: {
    drawLine() {
      let chartDom = document.getElementById('main');
      let myChart = echarts.init(chartDom);
      let option = option = {
        xAxis: {
          type: 'category',
          data: this.goodsNameList
        },
        yAxis: {
          type: 'value'
        },
        grid:{
          bottom:200+'px',
        },
        series: [
          {
            data: this.goodsSalesList,
            type: 'bar'
          }
        ]
      };
      option && myChart.setOption(option);
    },

    initCharts(nameData,seriesData){
      let chartDom = document.getElementById('main');
      let myChart = echarts.init(chartDom);
      let option = option = {
        xAxis: {
          type: 'category',
          data: nameData,
          axisLabel: {
            interval:0,
            rotate:-40
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: seriesData,
            type: 'bar'
          }
        ]
      };
      option && myChart.setOption(option);
    },

    // 向后端请求分类列表数据
    getCategory() {
      this.$axios
          .post("/api/product/getCategory", {})
          .then((res) => {
            const cate = res.data.category;
            this.categoryList = cate;
          })
          .catch((err) => {
            return Promise.reject(err);
          });
    },
    // 获取分类数据
    changeCategory(){
      this.goodsNameList = []
      this.goodsSalesList = []
      const api ="/api/product/getProductByCategory"
      this.$axios
          .post(api, {
            categoryID: this.category_name,
            currentPage: 1,
            pageSize: 10
          })
          .then(res => {
            // this.product = res.data.Product;
            // this.total = res.data.total;
            console.log(res)
            for (let i = 0; i < res.data.Product.length; i++) {
              this.goodsNameList.push(res.data.Product[i].product_name);
              this.goodsSalesList.push(res.data.Product[i].product_sales);
            }
            this.initCharts(this.goodsNameList,this.goodsSalesList)

          })
          .catch(err => {
            return Promise.reject(err);
          });
    },
  }
}
</script>

<style scoped>

</style>