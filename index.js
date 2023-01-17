import pagination from "./pagination.js";

const url = "https://vue3-course-api.hexschool.io/v2";
const path = "aurora-path";

let productModal = null;
let delProductModal = null;

const app = Vue.createApp({
  data() {
    return {
      is_new: false,
      deleteTemp: {},
      productList: [],
      pagination: {},
      tempProduct: { imagesUrl: [] },
    };
  },

  components: { pagination },

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

    getAllProduct(page = 1) {
      //預設參數
      axios
        .get(`${url}/api/${path}/admin/products/?page=${page}`)
        .then((res) => {
          console.log(res);
          this.pagination = res.data.pagination;
          this.productList = res.data.products;
        })
        .catch((error) => {
          alert(error.data.message);
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

    postDeleteProduct() {
      axios
        .delete(`${url}/api/${path}/admin/product/${this.deleteTemp.id}`)
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.getAllProduct();
        })
        .catch((error) => {
          alert(error.data.message);
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
});

app.component("productModalTemplate", {
  props: ["tempProduct", "is_new", "postProduct"],
  data() {
    return {
      picUpload: {},
    };
  },
  mounted() {
    const picUpload = document.querySelector("#picFile");
    this.picUpload = picUpload;
  },
  methods: {
    createPic() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
    uploadPic() {
      const file = this.picUpload.files[0];

      const formData = new FormData();
      formData.append("file-to-upload", file);

      axios
        .post(`${url}/api/${path}/admin/upload`, formData)
        .then((res) => {
          this.tempProduct.imageUrl = res.data.imageUrl;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },

  template: "#modal-dialog-template",
});

app.component("delModelTemplate", {
  props: ["deleteTemp", "postDeleteProduct"],
  template: "#delModel-dialog",
});

app.mount("#app");
