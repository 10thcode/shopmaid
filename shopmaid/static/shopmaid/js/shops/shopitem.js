export default {
  template: `
    <!-- TITLE BAR -->
    <div class="title-bar">
      <div class="heading">
        <h2>Item</h2>
      </div>
      <div class="buttons">
        <button class="add" @click="$router.push({name: 'add-to-list', params: { item: item.id }})">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>

    <!--ITEM DETAILS-->
    <div class="overview">
      <div class="title">
        <p>\${item.name}</p>
      </div>
      <div class="content">
        <p>\${item.description || 'No description'}</p>
      </div>
      <div class="amount">
        <p>\${(item.price + 0).toFixed(2)}</p>
      </div>
    </div>

    <section>
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Image</h2>
        </div>
      </div>

      <div class="overview">
        <div class="image">
          <img :src="item.image"/>
        </div>
      </div>
    </section>
  `,

  data(){
    return {
      item: {}
    }
  },

  async created(){
    await this.getItem()
  },

  methods: {
    async getItem(){
      var response = await fetch(`http://localhost:8000/api/searchshopitems/${parseInt(this.$route.params.item)}/`)
      if(response.ok){
        this.item = await response.json()
      }else if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },

    getCookie(key) {
      var value = decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;

      if (value && value.substring(0, 1) === '{' && value.substring(value.length - 1, value.length) === '}') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
      return value;
    },
  }
}
