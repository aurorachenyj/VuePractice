const url = "https://vue3-course-api.hexschool.io/v2";
const path = "aurora-path";

let productModal = null;
let delProductModal = null;

const app = {
  data() {
    return {
      is_new: false,
      tempImg: "",
      deleteTemp: {},
      productList: [],
      tempProduct: { imagesUrl: [] },
    };
  },

  methods: {
    checkLogin() {
      axios
        .post(`${url}/api/user/check`)
        .then((res) => {
          this.getAllProduct();
        })
        .catch((error) => {
          alert(error.data.message);
          location.href = "login.html";
        });
    },

    getAllProduct() {
      axios
        .get(`${url}/api/${path}/admin/products`)
        .then((res) => {
          this.productList = res.data.products;
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },

    // 優化
    openModel(item, action) {
      // 新增 修改 刪除
      if (action === "add") {
        this.is_new = true;
        productModal.show();
        this.tempProduct = {
          imagesUrl: [],
        };
      } else if (action === "edit") {
        this.tempProduct = { ...item };
        this.is_new = false;
        productModal.show();
      } else if (action === "del") {
        this.deleteTemp = item;
        delProductModal.show();
      }
    },

    // 舊寫法
    // addNewProduct() {
    //   console.log(this.tempProduct);
    //   this.is_new = true;
    //   productModal.show();

    //   this.tempProduct = {
    //     imagesUrl: [],
    //   };

    //   // 因為各input欄位有用v-model雙向綁定，所以60-67行不用一個個寫出來
    //   // this.tempProduct = {
    //   //   title: this.title,
    //   //   category: this.category,
    //   //   origin_price: this.origin_price,
    //   //   unit: this.unit,
    //   //   description: this.description,
    //   //   content: this.content,
    //   //   is_enabled: 1,
    //   //   imageUrl: this.imageUrl,
    //   //   imagesUrl: [],
    //   // };
    // },

    // editData(item) {
    //   this.tempProduct = { ...item };
    //   this.is_new = false;
    //   productModal.show();
    //   console.log(item);

    //   console.log(this.tempProduct);
    //   console.log(this.is_new);
    // },

    // deleteProduct(item) {
    //   console.log(item);
    //   this.deleteTemp = item;
    //   delProductModal.show();
    // },

    postProduct() {
      let apiUrl = `${url}/api/${path}/admin/product`;
      let method = `post`;

      if (!this.is_new) {
        apiUrl = `${url}/api/${path}/admin/product/${this.tempProduct.id}`;
        method = `put`;
      }

      axios[method](apiUrl, {
        data: this.tempProduct,
      })
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          this.getAllProduct();
        })

        .catch((error) => {
          alert(error.data.message);
        });
    },

    addPicArray() {
      if (this.tempProduct.imagesUrl === undefined) {
        this.tempProduct.imagesUrl = [];
      }

      this.tempProduct.imagesUrl.push(this.tempImg);
      this.tempImg = "";
    },

    delPic() {
      if (
        this.tempProduct.imagesUrl === undefined ||
        this.tempProduct.imagesUrl.length <= 0
      ) {
        alert("尚未新增圖片，無法刪除");
        return;
      }

      this.tempProduct.imagesUrl.pop();
    },

    postDeleteProduct() {
      console.log(this.deleteTemp);
      axios
        .delete(`${url}/api/${path}/admin/product/${this.deleteTemp.id}`)
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.getAllProduct();
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
  },
  mounted() {
    // bootstrap Modal 起手式
    productModal = new bootstrap.Modal(
      document.querySelector("#productModal"),
      { keyboard: false }
    );

    delProductModal = new bootstrap.Modal(
      document.querySelector("#delProductModal"),
      { keyboard: false }
    );

    // 把登入時存的 token 拿出來，設定在axios的header裡，並執行checkLogin 確認是否已登入
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    axios.defaults.headers.common["Authorization"] = token;
    this.checkLogin();
  },
};

Vue.createApp(app).mount("#app");
