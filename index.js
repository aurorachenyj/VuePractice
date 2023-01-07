const url = "https://vue3-course-api.hexschool.io/v2";
const path = "aurora-path";
const app = {
  data() {
    return {
      productList: [],
      temp: {},
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

    showProduct(item) {
      this.temp = item;
      console.log(this.temp);
    },
  },
  mounted() {
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
