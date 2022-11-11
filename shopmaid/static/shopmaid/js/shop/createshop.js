export default {
  template: `
  <form @submit.prevent="createShop()">
    <!-- TITLE BAR -->
    <div class="title-bar">
      <div class="heading">
        <h2>Create new shop</h2>
      </div>
      <div class="buttons">
        <button class="done" type="submit">
          <i class="fa-solid fa-check"></i>
        </button>
      </div>
    </div>

    <!--FORM FIELDS-->
    <div class="fields">
      <div class="field">
        <label>Name: </label>
        <input type="text" ref="name" v-model="shop.name" placeholder="e.g. Shopmaid Provisions Shop" maxlength="120" required>
      </div>

      <div class="field">
        <label>Category:</label>
        <select v-model="shop.category" required>
          <option>Provisions</option>
          <option>Fashion</option>
          <option>Beauty</option>
          <option>Books</option>
          <option>Food and Drinks</option>
          <option>Art Gallery</option>
          <option>Electronics</option>
          <option>Luxury</option>
          <option>Mechanic</option>
          <option>Sports</option>
          <option>Drugs</option>
          <option>Hardwares</option>
          <option>Supermarket</option>
          <option>Minimart</option>
          <option>Alcoholic Drinks</option>
          <option>Other</option>
        </select>
      </div>

      <div class="field">
        <label>Address: </label>
        <input type="text" ref="address" v-model="shop.address" placeholder="e.g. 121b Baker Street, England" required>
      </div>
    </div>
  </form>
  `,

  data(){
    return {
      shop: {
        name: '',
        category: '',
        address: '',
        user: {},
      }
    }
  },

  async created(){
    await this.getUser()
  },

  methods: {

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

    async getUser(){
      var response = await fetch('http://localhost:8000/api/user')
      if(response.ok){
        this.shop.user = await response.json();
      }else if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },

    async createShop(){
      var formData = new FormData();
      formData.append('name', this.shop.name)
      formData.append('category', this.shop.category)
      formData.append('address', this.shop.address)
      formData.append('user', this.shop.user.user)
      var response = await fetch('http://localhost:8000/api/shops/', {
        method: 'post',
        headers: {
          'X-CSRFToken': this.getCookie('csrftoken'),
          'Accept': 'application/json'
        },
        body: formData
      })
      if(response.ok){
        this.$router.push('/myshop/manage')
      }else if(response.status === 400) {
        var errors = await response.json()
        this.$refs[Object.keys(errors)[0]].setCustomValidity(errors[Object.keys(errors)[0]]);
        this.$refs[Object.keys(errors)[0]].reportValidity();
        this.$refs[Object.keys(errors)[0]].setCustomValidity('');
      }else if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },
  }
}
