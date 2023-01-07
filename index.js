const url = "https://vue3-course-api.hexschool.io/v2";
const path = "aurora-path";

// 不太懂 5-6行 為何要這樣寫? 猜測:先宣告起來(用 null 暫時設定)，在mounted裡面把該區域抓取起來
let productModal = null;
let delProductModal = null;

const app = {
  data() {
    return {
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
          console.log(res.data);
          this.getAllProduct();
        })
        .catch((error) => {
          console.log(error);
          location.href = "login.html";
        });
    },

    getAllProduct() {
      axios
        .get(`${url}/api/${path}/admin/products`)
        .then((res) => {
          // console.log(res.data);
          this.productList = res.data.products;
          // console.log(this.productList);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // showProduct(item) {
    //   this.temp = item;
    //   console.log(this.temp);
    // },

    addNewProduct() {
      //   console.log(this.tempProduct);
      productModal.show();
      this.tempProduct = {
        title: this.title,
        category: this.category,
        origin_price: this.origin_price,
        unit: this.unit,
        description: this.description,
        content: this.content,
        is_enabled: 1,
        imageUrl: this.imageUrl,
      };
    },

    postNewProduct() {
      console.log(this.tempProduct);

      axios
        .post(`${url}/api/${path}/admin/product`, {
          data: this.tempProduct,
        })
        .then((res) => {
          console.log(res.data);
          alert(res.data.message);
          productModal.hide();
          this.getAllProduct();
        })

        .catch((error) => {
          console.log(error);
        });
    },

    deleteProduct(item) {
      console.log(item);
      this.deleteTemp = item;
      delProductModal.show();
    },

    postDeleteProduct() {
      console.log(this.deleteTemp);
      axios
        .delete(`${url}/api/${path}/admin/product/${this.deleteTemp.id}`)
        .then((res) => {
          console.log(res.data);
          alert(res.data.message);
          delProductModal.hide();
          this.getAllProduct();
        })
        .catch((error) => {
          console.log(error);
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
    // console.log(token);
    axios.defaults.headers.common["Authorization"] = token;
    this.checkLogin();
  },
};

Vue.createApp(app).mount("#app");
