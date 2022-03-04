<template>
  <div class="order" v-loading="isAjax">
    <!-- 我的订单头部 -->
    <!--    <div class="order-header">-->
    <!--      <div class="order-header-content">-->
    <!--        <p>-->
    <!--          <i class="el-icon-s-order" style="font-size: 30px;color: #ff6700;"></i>-->
    <!--          我的订单-->
    <!--        </p>-->
    <!--      </div>-->
    <!--    </div>-->
    <!-- 我的订单头部END -->
    <div style="height: 34px;width: 100%;display: flex;flex-wrap: nowrap;justify-content: flex-end;margin: 10px 0;">
      <el-input v-model="search" style="width: 300px" size="small" placeholder="请输入要查找的内容"></el-input>
      <el-button @click="getData" size="small" style="margin: 0 30px;">查询</el-button>
    </div>

    <!-- 我的订单主要内容 -->
    <template v-if="initData">
      <el-scrollbar style="height: 750px">
        <div class="order-content" >
          <div class="content" v-for="(item,index) in orders" :key="index">
            <ul>
              <!-- 我的订单表头 -->
              <li class="order-info">
                <div class="order-id">订单编号: {{ item[0].order_id }}</div>
                <div class="order-id" style="margin-left: 100px;">用户名: {{ item[0].user_name }}</div>
                <div class="order-time">订单时间: {{ item[0].order_time | dateFormat }}</div>
              </li>
              <li class="header" style="height: 40px;">
                <div class="pro-img" style="height: 40px;line-height: 40px"></div>
                <div class="pro-name" style="height: 40px;line-height: 40px">商品名称</div>
                <div class="pro-price" style="height: 40px;line-height: 40px">单价</div>
                <div class="pro-num" style="height: 40px;line-height: 40px">数量</div>
                <div class="pro-total" style="height: 40px;line-height: 40px">小计</div>
              </li>
              <!-- 我的订单表头END -->

              <!-- 订单列表 -->
              <li class="product-list" v-for="(product,i) in item" :key="i">
                <div class="pro-img">
                  <router-link :to="{ path: '/goods/details', query: {productID:product.product_id} }">
                    <img :src="product.product_picture"/>
                  </router-link>
                </div>
                <div class="pro-name">
                  <router-link
                      :to="{ path: '/goods/details', query: {productID:product.product_id} }"
                  >{{ product.product_name }}
                  </router-link>
                </div>
                <div class="pro-price">{{ product.product_price }}元</div>
                <div class="pro-num">{{ product.product_num }}</div>
                <div class="pro-total pro-total-in">{{ product.product_price * product.product_num }}元</div>
              </li>
            </ul>
            <div class="order-bar">
              <div class="order-bar-left">
            <span class="order-total">
              共
              <span class="order-total-num">{{ total[index].totalNum }}</span> 件商品
            </span>
              </div>
              <div class="order-bar-right">
            <span>
              <span class="total-price-title">合计：</span>
              <span class="total-price">{{ total[index].totalPrice }}元</span>
            </span>
              </div>
              <!-- 订单列表END -->
            </div>
          </div>
          <div style="margin-top:-40px;"></div>

        </div>
      </el-scrollbar>
      <!-- 我的订单主要内容END -->
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="pageTotal"
            @current-change="currentChange"
        ></el-pagination>
      </div>

      <!-- 分页END -->
    </template>
    <!-- 订单为空的时候显示的内容 -->
    <div v-else class="order-empty">
      <div class="empty">
        <h2>您的订单还是空的！</h2>
        <p>快去购物吧！</p>
      </div>
    </div>
    <!-- 订单为空的时候显示的内容END -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      orders: [], // 订单列表
      total: [], // 每个订单的商品数量及总价列表
      initData: false,
      isAjax: false,
      pageSize: 10,
      pageTotal: 0,
      currentPage: 1,
      search: ""
    };
  },
  created() {
    // 获取订单数据
    // this.isAjax = true
    this.getData()
  },
  watch: {
    // 通过订单信息，计算出每个订单的商品数量及总价
    orders: function (val) {
      let total = [];
      for (let i = 0; i < val.length; i++) {
        const element = val[i];

        let totalNum = 0;
        let totalPrice = 0;
        for (let j = 0; j < element.length; j++) {
          const temp = element[j];
          totalNum += temp.product_num;
          totalPrice += temp.product_price * temp.product_num;
        }
        totalPrice = totalPrice.toFixed(2)
        total.push({totalNum, totalPrice});
      }
      this.total = total;
    }
  },
  methods: {
    // 页码变化调用currentChange方法
    currentChange(currentPage) {
      this.currentPage = currentPage;
      this.getData()
    },
    getData() {
      this.isAjax = true
      this.$axios
          .post("/api/admin/order/getOrder", {
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            search: this.search
          })
          .then(res => {
            this.isAjax = false
            this.orders = res.data.orders;
            this.pageTotal = res.data.total;
            this.$nextTick(() => {
              this.initData = true;
            })
          })
    }
  }

};
</script>
<style scoped>
.order {
  height: calc(100% - 40px);
  background-color: #f5f5f5;
  padding-bottom: 20px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-between;
}

/* 我的订单头部CSS */
.order .order-header {
  height: 64px;
  border-bottom: 2px solid #ff6700;
  background-color: #fff;
  margin-bottom: 20px;
}

.order .order-header .order-header-content {
  width: 1225px;
  margin: 0 auto;
}

.order .order-header p {
  font-size: 28px;
  line-height: 58px;
  float: left;
  font-weight: normal;
  color: #424242;
}

/* 我的订单头部CSS END */
.order .content {
  width: 1225px;
  margin: 0 auto;
  background-color: #fff;
  margin-bottom: 10px;
}

.order .content ul {
  background-color: #fff;
  color: #424242;
  line-height: 85px;
}

/* 我的订单表头CSS */
.order .content ul .order-info {
  height: 30px;
  line-height: 30px;
  padding: 0 26px;
  color: #424242;
  border-bottom: 1px solid #ff6700;
}

.order .content ul .order-info .order-id {
  float: left;
  color: #ff6700;
}

.order .content ul .order-info .order-time {
  float: right;
}

.order .content ul .header {
  height: 85px;
  padding-right: 26px;
  color: #424242;
}

/* 我的订单表头CSS END */

/* 订单列表CSS */
.order .content ul .product-list {
  height: 85px;
  padding: 15px 26px 15px 0;
  border-top: 1px solid #e0e0e0;
}

.order .content ul .pro-img {
  float: left;
  height: 85px;
  width: 120px;
  padding-left: 80px;
}

.order .content ul .pro-img img {
  height: 80px;
  width: 80px;
}

.order .content ul .pro-name {
  float: left;
  width: 380px;
}

.order .content ul .pro-name a {
  color: #424242;
}

.order .content ul .pro-name a:hover {
  color: #ff6700;
}

.order .content ul .pro-price {
  float: left;
  width: 160px;
  padding-right: 18px;
  text-align: center;
}

.order .content ul .pro-num {
  float: left;
  width: 190px;
  text-align: center;
}

.order .content ul .pro-total {
  float: left;
  width: 160px;
  padding-right: 81px;
  text-align: right;
}

.order .content ul .pro-total-in {
  color: #ff6700;
}

.order .order-bar {
  width: 1185px;
  padding: 0 20px;
  border-top: 1px solid #ff6700;
  height: 50px;
  line-height: 50px;
  background-color: #fff;
}

.order .order-bar .order-bar-left {
  float: left;
}

.order .order-bar .order-bar-left .order-total {
  color: #757575;
}

.order .order-bar .order-bar-left .order-total-num {
  color: #ff6700;
}

.order .order-bar .order-bar-right {
  float: right;
}

.order .order-bar .order-bar-right .total-price-title {
  color: #ff6700;
  font-size: 14px;
}

.order .order-bar .order-bar-right .total-price {
  color: #ff6700;
  font-size: 30px;
}

/* 订单列表CSS END */

/* 订单为空的时候显示的内容CSS */
.order .order-empty {
  width: 1225px;
  margin: 0 auto;
}

.order .order-empty .empty {
  height: 300px;
  padding: 0 0 130px 558px;
  margin: 65px 0 0;
  background: url(../assets/imgs/cart-empty.png) no-repeat 124px 0;
  color: #b0b0b0;
  overflow: hidden;
}

.order .order-empty .empty h2 {
  margin: 70px 0 15px;
  font-size: 36px;
}

.order .order-empty .empty p {
  margin: 0 0 20px;
  font-size: 20px;
}

/* 订单为空的时候显示的内容CSS END */
</style>