export default {
  // "getAllProduct"
  props: ["pages"],
  methods: {
    checkPage(page) {
      //   console.log(page);
      this.$emit("emit-page", page);
    },
  },
  template: `   <nav aria-label="Page navigation example">
  <ul class="pagination justify-content-center">

    <li class="page-item"  :class="{ disabled : !pages.has_pre  }"   >
      <a class="page-link" href="#" aria-label="Previous"  @click="checkPage(pages.current_page - 1 )" >
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>

    <li class="page-item"  v-for="(page , key  ) in  pages.total_pages" :key="page + page"  :class="{ active: page === pages.current_page }"   ><a class="page-link" href="#"  @click="checkPage(page)" > {{page}} </a></li>
  
    <li class="page-item"   :class="{ disabled:!pages.has_next}"   >
      <a class="page-link" href="#" aria-label="Next"  @click="checkPage(pages.current_page + 1 )" >
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>

  </ul>
</nav> `,
};

// 把父層事件 使用 props 傳進子元件 的寫法 ( 此作法較不正規 )
// 第19行<a>標籤  @click="getAllProduct(page)" 要把當下按到的頁數(v-for)的page丟進來作為參數
// 前一頁 @click="getAllProduct(pages.current_page - 1)"
// 數字 @click.prevent="getAllProduct(page)"
// 後一頁 @click="getAllProduct(pages.current_page + 1)"
