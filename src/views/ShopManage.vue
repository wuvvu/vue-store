<template>
  <div class="shop-manege-box">
    <div class="box-title">商品管理</div>
    <div class="search-box">
      <el-select v-model="category_name" placeholder="请选择需要查询的分类" size="small">
        <el-option
          v-for="item in categoryList"
          :key="item.category_id"
          :label="item.category_name"
          :value="item.category_id"
        >
        </el-option>
      </el-select>
      <el-input style="width:300px;margin: 0 15px;" size="small" placeholder="请输入商品名称" v-model="goodSearch"></el-input>
      <el-button size="small">查询</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="date" label="日期" width="150">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120"> </el-table-column>
      <el-table-column prop="province" label="省份" width="120">
      </el-table-column>
      <el-table-column prop="city" label="市区" width="120"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
      <el-table-column prop="zip" label="邮编" width="120"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >查看</el-button
          >
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="total"
          @current-change="currentChange"
      ></el-pagination>
    </div>
    <!-- 分页END -->
  </div>
</template>

<script>
export default {
  name: "ShopManage",
  methods: {
    handleClick(row) {
      console.log(row);
    },
    // 向后端请求分类列表数据
    getCategory() {
      this.$axios
        .post("/api/product/getCategory", {})
        .then((res) => {
          const val = {
            category_id: 0,
            category_name: "全部",
          };
          const cate = res.data.category;
          cate.unshift(val);
          this.categoryList = cate;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },

    // 页码变化调用currentChange方法
    currentChange(currentPage) {
      this.currentPage = currentPage;
      // if (this.search != "") {
      //   this.getProductBySearch();
      // } else {
      //   this.getData();
      // }
      // this.backtop();
    },
  },

  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1517 弄",
          zip: 200333,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1519 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1516 弄",
          zip: 200333,
        },
      ],
      categoryList: "", //分类列表
      category_name:'',// 分类搜索
      goodSearch:"", // 分类名称搜索
      pageSize: 15, // 每页显示的商品数量
      currentPage: 1, //当前页码
      total: 0, // 商品总量


    };
  },

  created() {
    // 获取分类列表
    this.getCategory();
  },
};
</script>

<style>
.shop-manege-box {
  margin: 0 20px;
  padding: 10px;
  background-color: #fff;
  height: calc(100% - 20px);
}
.search-box{
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-end;
    padding: 15px 0;
}
 .pagination {
  height: 50px;
  text-align: center;
   margin-top: 10px;
}
</style>