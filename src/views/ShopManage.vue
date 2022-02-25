<template>
  <div class="shop-manege-box">
    <div class="box-title">
      <div class="title-text">商品管理</div>
      <div class="upload-good">
        <el-button size="small" @click="openUpload">上传商品</el-button>
      </div>
    </div>
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
    <el-table :data="product" border style="width: 100%">
      <el-table-column fixed prop="product_name" label="商品名称"></el-table-column>
      <el-table-column prop="product_intro" label="商品描述"></el-table-column>
      <el-table-column prop="product_title" label="商品标题"> </el-table-column>
      <el-table-column prop="product_num" label="商品数量" width="120"> </el-table-column>
      <el-table-column prop="product_price" label="原价" width="120"> </el-table-column>
      <el-table-column prop="product_selling_price" label="活动价格" width="120"> </el-table-column>
      <el-table-column prop="product_sales" label="销量" width="120"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="delGoods(scope.row)">删除</el-button>
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

<!--    上传弹窗-->
    <el-dialog
        title="商品详情"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
      <el-form ref="uploadForm" :model="uploadForm" label-width="80px" size="small">
        <el-form-item prop="product_name" label="商品名称">
          <el-input v-model="uploadForm.product_name"></el-input>
        </el-form-item>
        <el-form-item prop="region" label="商品分类">
          <el-select v-model="uploadForm.category_id" placeholder="请选择分类">
            <el-option
                v-for="item in categoryList"
                :key="item.category_id"
                :label="item.category_name"
                :value="item.category_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="product_num" label="商品数量">
          <el-input-number v-model="uploadForm.product_num" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item prop="product_picture" label="商品图片">
          <input ref="inputFile" type="file" @change="inputFile" style="opacity: 0;width: 0" />
          <el-button type="primary" size="small" @click="uploadClick">点击上传</el-button>
          <div style="width: 100%;height: 220px;display: flex;flex-wrap: wrap;border: #dddddd 1px dashed ">
            <div v-for="(item,index) in uploadForm.product_picture" :key="index" style="width: 100px;height: 100px;display: flex;margin-right: 5px;margin-top: 5px;">
              <i class="el-icon-circle-close del-icon" @click="delImg(index)"></i>
              <el-image style="width: 100px; height: 100px"
                        :src="item"
                        fit="contain"></el-image>
            </div>
          </div>


        </el-form-item>
        <el-form-item prop="product_price" label="商品原价">
          <el-input type="number" v-model="uploadForm.product_price"></el-input>
        </el-form-item>
        <el-form-item prop="product_selling_price" label="商品现价">
          <el-input type="number" v-model="uploadForm.product_selling_price"></el-input>
        </el-form-item>
        <el-form-item prop="product_intro" label="商品描述">
          <el-input type="textarea" v-model="uploadForm.product_intro"></el-input>
        </el-form-item>
        <el-form-item prop="product_title" label="商品标题">
          <el-input type="textarea" v-model="uploadForm.product_title"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="uploadGoods" >确 定</el-button>
  </span>
    </el-dialog>

<!--    编辑弹窗-->
    <el-dialog
        title="商品详情"
        :visible.sync="editDialogVisible"
        width="30%"
        :before-close="handleClose">
      <el-form ref="uploadForm" :model="uploadForm" label-width="80px" size="small">
        <el-form-item prop="product_name" label="商品名称">
          <el-input v-model="uploadForm.product_name"></el-input>
        </el-form-item>
        <el-form-item prop="region" label="商品分类">
          <el-select v-model="uploadForm.category_id" placeholder="请选择分类">
            <el-option
                v-for="item in categoryList"
                :key="item.category_id"
                :label="item.category_name"
                :value="item.category_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="product_num" label="商品数量">
          <el-input-number v-model="uploadForm.product_num" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item prop="product_picture" label="商品图片">
          <input ref="inputFile" type="file" @change="inputFile" style="opacity: 0;width: 0" />
          <el-button type="primary" size="small" @click="uploadClick">点击上传</el-button>
          <div style="width: 100%;height: 220px;display: flex;flex-wrap: wrap;border: #dddddd 1px dashed ">
            <div v-for="(item,index) in uploadForm.product_picture" :key="index" style="width: 100px;height: 100px;display: flex;margin-right: 5px;margin-top: 5px;">
              <i class="el-icon-circle-close del-icon" @click="delImg(index)"></i>
              <el-image style="width: 100px; height: 100px"
                        :src="item"
                        fit="contain"></el-image>
            </div>
          </div>
        </el-form-item>
        <el-form-item prop="product_price" label="商品原价">
          <el-input type="number" v-model="uploadForm.product_price"></el-input>
        </el-form-item>
        <el-form-item prop="product_selling_price" label="商品现价">
          <el-input type="number" v-model="uploadForm.product_selling_price"></el-input>
        </el-form-item>
        <el-form-item prop="product_intro" label="商品描述">
          <el-input type="textarea" v-model="uploadForm.product_intro"></el-input>
        </el-form-item>
        <el-form-item prop="product_title" label="商品标题">
          <el-input type="textarea" v-model="uploadForm.product_title"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="editGoods" >确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ShopManage",
  data() {
    return {
      categoryList: "", //分类列表
      category_name:'',// 分类搜索
      goodSearch:"", // 分类名称搜索
      pageSize: 10, // 每页显示的商品数量
      currentPage: 1, //当前页码
      total: 0, // 商品总量
      product:[], //商品信息
      dialogVisible:false,
      editDialogVisible:false,
      uploadForm: {
        category_id: '', //分类
        product_intro: '', //描述
        product_name: '', //名称
        product_num: '', // 数量
        product_picture: [], // 图片
        product_price: '', // 原价
        product_sales: '', // 销量
        product_selling_price: '', //现价
        product_title: '' //  标题
      },
      imgUrlNameList:[],
      editId: 0
    };
  },

  methods: {
    handleClick(row) {
      // 获取商品图片
        this.$axios
            .post("/api/product/getDetailsPicture", {
              productID: row.product_id
            })
            .then(res => {
              console.log(res)
              this.uploadForm = row;
              this.uploadForm.product_picture = [];
              for(let i = 0; i<res.data.ProductPicture.length;i++){
                console.log(res.data.ProductPicture[i].product_picture)
                this.uploadForm.product_picture.push(res.data.ProductPicture[i].product_picture)
              }
              this.editDialogVisible = true;

            })
            .catch(err => {
              return Promise.reject(err);
            });

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
      this.getData()
    },

    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(()=> {
            done();
            this.cancel();
          })
          .catch(()=> {});
    },

    // 上传
    openUpload(){
      this.dialogVisible = true;
    },
    //上架
    uploadGoods(){
      const api = "/api/admin/product/addProduct"
      this.$axios
          .post(api, {
            category_id: this.uploadForm.category_id, //分类
            product_intro: this.uploadForm.product_intro, //描述
            product_name: this.uploadForm.product_name, //名称
            product_picture: this.uploadForm.product_picture, // 图片
            product_price: this.uploadForm.product_price, // 原价
            product_selling_price: this.uploadForm.product_selling_price, //现价
            product_title: this.uploadForm.product_title, //  标题
            product_num: this.uploadForm.product_num, // 数量
          })
          .then(res => {
            console.log(res)
            this.dialogVisible = false;
          })
          .catch(err => {
            return Promise.reject(err);
          });
    },

    //编辑商品
    editGoods(){
      const api = "/api/admin/product/updateProduct"
      this.$axios
          .post(api, {
            product_id:this.uploadForm.product_id,
            category_id: this.uploadForm.category_id, //分类
            product_intro: this.uploadForm.product_intro, //描述
            product_name: this.uploadForm.product_name, //名称
            product_picture: this.uploadForm.product_picture, // 图片
            product_price: this.uploadForm.product_price, // 原价
            product_selling_price: this.uploadForm.product_selling_price, //现价
            product_title: this.uploadForm.product_title, //  标题
            product_num: this.uploadForm.product_num, // 数量
          })
          .then(res => {
            console.log(res)
            this.editDialogVisible = false;
          })
          .catch(err => {
            return Promise.reject(err);
          });
    },

    // 删除商品
    delGoods(e){
      console.log(e)
    //   const api = "/api/admin/product/updateProduct"
    //   this.$axios
    //       .post(api, {
    //         product_id:e.product_id,
    //       })
    //       .then(res => {
    //         console.log(res)
    //       })
    //       .catch(err => {
    //         return Promise.reject(err);
    //       });
    // },

    // 向后端请求全部商品或分类商品数据
    getData() {
      // 如果分类列表为空则请求全部商品数据，否则请求分类商品数据
      const api ="/api/product/getAllProduct"
      this.$axios
          .post(api, {
            categoryID: this.categoryID,
            currentPage: this.currentPage,
            pageSize: this.pageSize
          })
          .then(res => {
            this.product = res.data.Product;
            this.total = res.data.total;
          })
          .catch(err => {
            return Promise.reject(err);
          });
    },

    // 上传成功
    uploadClick(){
      this.$refs['inputFile'].dispatchEvent(new MouseEvent('click'))
    },
    inputFile(e){
      this.isUpload=true;
      let file=e.target.files[0];
      const fileName = file.name;
      let url='';
      let reader = new FileReader();
      reader.readAsDataURL(file);
      let that=this;
      reader.onload = function () {
        url=this.result.substring(this.result.indexOf(',')+1);
        // that.imgUrl='data:image/png;base64,'+url
        // that.$refs['imgimg'].setAttribute('src','data:image/png;base64,'+url);
        that.imgUrlNameList.push({
          name:fileName+1,
        })
        that.uploadForm.product_picture.push('data:image/png;base64,'+url)
      };
    },

    //删除图片
    delImg(index){
      this.imgUrlNameList.splice(index,1);
      this.uploadForm.product_picture.splice(index,1);
      this.$message.success('删除成功!');
    },

    //取消上传
    cancel(){
      this.dialogVisible = false;
      this.$refs.uploadForm.resetFields()
    }
  },


  created() {
    // 获取分类列表
    this.getCategory();
    this.getData()
  },
};
</script>

<style scoped>
.box-title{
  width: 100%;
  height: 55px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  border-bottom: #dddddd solid 1px;
}

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

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.del-icon:hover{
  color: #005cc5;
  cursor:pointer;
}
</style>