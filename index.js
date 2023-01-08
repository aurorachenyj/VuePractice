const url = "https://vue3-course-api.hexschool.io/v2";
const path = "aurora-path";

// 不太懂 5-6行 為何要這樣寫? 猜測:先宣告起來(用 null 暫時設定)，在mounted裡面把該區域抓取起來
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
          this.productList = res.data.products;
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
      this.is_new = true;
      console.log("有跑!!!!");
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
        imagesUrl: [],
      };
      console.log(this.tempProduct);
    },

    editData(item) {
      console.log(555);
      this.tempProduct = { ...item };
      this.is_new = false;
      productModal.show();
      console.log(item);

      console.log(this.tempProduct);
      console.log(this.is_new);
    },

    postProduct() {
      let apiUrl = `${url}/api/${path}/admin/product`;
      let method = `post`;

      console.log(this.tempProduct);
      if (!this.is_new) {
        apiUrl = `${url}/api/${path}/admin/product/${this.tempProduct.id}`;
        method = `put`;
      }

      axios[method](apiUrl, {
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

    addPicArray() {
      if (this.tempProduct.imagesUrl === undefined) {
        this.tempProduct.imagesUrl = [];
      }

      this.tempProduct.imagesUrl.push(this.tempImg);
      this.tempImg = "";
    },

    delPic() {
      console.log(this.tempProduct.imagesUrl);
      if (
        this.tempProduct.imagesUrl === undefined ||
        this.tempProduct.imagesUrl.length <= 0
      ) {
        alert("尚未新增圖片，無法刪除");
        return;
      }
      // console.log(this.tempProduct.imagesUrl);
      this.tempProduct.imagesUrl.pop();
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

    // test(item) {
    //   con;
    // },
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
