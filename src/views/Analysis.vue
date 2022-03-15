<template>
  <div style="height: calc(100% - 40px);width: calc(100% - 40px);background-color: #fff;padding: 20px"
       v-loading="isAjax">
    <div style="border-bottom: #dddddd 1px solid;display: flex;align-items: center; height: 30px;font-size: 18px">市场分析
    </div>
    <div class="echarts-box">
      <div style="border: #dddddd 1px solid;margin-top: 25px;width: 46%;padding: 15px">
        <span style="font-size: x-large;">销量分析</span>
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
        <div id="main" :style="{width: '100%', height: '600px'}"></div>
      </div>
      <div style="border: #dddddd 1px solid;margin-top: 25px;width: 46%;padding: 15px">
        <span style="font-size: x-large;">分类销量分析</span>
        <div id="pieMain" :style="{width: '100%', height: '600px'}"></div>
      </div>
    </div>

  </div>
</template>

<script>

import * as echarts from 'echarts';

export default {
  name: "Analysis",
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      category_name: 1,// 分类搜索
      categoryList: "", //分类列表
      goodsNameList: [],
      goodsSalesList: [],
      isAjax: false,
      categoryName: [],
      categoryNum: []

    }
  },
  created() {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user.userName !== "admin") {
      this.$message.error("请使用管理员账号进入！")
      this.$router.push({path: "/"});
      this.$router.go(0);
    } else {
      this.getCategory()
      this.changeCategory()
      this.getData()
    }
  },
  mounted() {
    this.drawLine();
    this.drawPie();
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
        grid: {
          bottom: 250 + 'px',
          right: 200 + "px"
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
    drawPie() {
      let chartDom = document.getElementById('pieMain');
      let myChart = echarts.init(chartDom);
      let option = option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'line',
            smooth: true,
            data: [120, 132, 101, 134, 90, 230, 210]
          }
        ]
      };
      option && myChart.setOption(option);
    },
    initCharts(nameData, seriesData) {
      let chartDom = document.getElementById('main');
      let myChart = echarts.init(chartDom);
      let option = option = {
        xAxis: {
          type: 'category',
          data: nameData,
          axisLabel: {
            interval: 0,
            rotate: -40
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
    changeCategory() {
      this.isAjax = true;
      this.goodsNameList = []
      this.goodsSalesList = []
      const api = "/api/product/getProductByCategory"
      this.$axios
          .post(api, {
            categoryID: this.category_name,
            currentPage: 1,
            pageSize: 10
          })
          .then(res => {
            // this.product = res.data.Product;
            // this.total = res.data.total;
            for (let i = 0; i < res.data.Product.length; i++) {
              this.goodsNameList.push(res.data.Product[i].product_name);
              this.goodsSalesList.push(res.data.Product[i].product_sales);
            }
            this.isAjax = false;
            this.initCharts(this.goodsNameList, this.goodsSalesList)

          })
          .catch(err => {
            return Promise.reject(err);
          });
    },

    // 请求分类总销量
    getData() {
      this.isAjax = true
      this.$axios
          .post("/api/admin/product/getCategorySales")
          .then(res => {
            this.isAjax = false
            for (let i = 0; i < res.data.categorySales.length; i++) {
              this.categoryName.push(res.data.categorySales[i].category_name)
              this.categoryNum.push(res.data.categorySales[i].total)
            }
            this.initPieChart(this.categoryName, this.categoryNum)
          })
    },

    initPieChart(name, num) {
      let chartDom = document.getElementById('pieMain');
      let myChart = echarts.init(chartDom);
      let option = option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          data: name
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'line',
            smooth: true,
            data: num
          }
        ]
      };
      option && myChart.setOption(option);
    }
  }
}
</script>

<style scoped>
.echarts-box {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
</style>