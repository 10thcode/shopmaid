export default {
  template: `
  <form @submit.prevent="editShop()">
    <!-- TITLE BAR -->
    <div class="title-bar">
      <div class="heading">
        <h2>Contact us</h2>
      </div>
      <div class="buttons">
        <button class="cancel" type="button" @click="$router.back()">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <button class="done" type="submit">
          <i class="fa-solid fa-check"></i>
        </button>
      </div>
    </div>

    <!--FORM FIELDS-->
    <div class="fields">
      <div class="field">
        <label>Phone: </label>
        <input type="text" ref="phone" v-model="shop.phone" placeholder="e.g. 0541234567" maxlength="10" required>
      </div>

      <div class="field">
        <label>Email: </label>
        <input type="text" ref="email" v-model="shop.email" placeholder="e.g. example@gmail.com" required>
      </div>
    </div>
  </form>
  `,

  data(){
    return {
      shop: {}
    }
  },

  async created(){
    await this.getShop()
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
        var user = await response.json();
        return user.user
      }else if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },

    async getShop(){
      var response = await fetch('http://localhost:8000/api/shops')
      if(response.ok){
        var res = await response.json()
        this.shop = res[0]
      }else if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },

    async editShop(){
      var formData = new FormData();
      formData.append('phone', this.shop.phone)
      formData.append('user', await this.getUser())
      formData.append('email', this.shop.email)
      var response = await fetch(`http://localhost:8000/api/shops/${this.shop.id}/`, {
        method: 'put',
        headers: {
          'X-CSRFToken': this.getCookie('csrftoken'),
          'Accept': 'application/json'
        },
        body: formData
      })
      if(response.status === 200){
        this.$router.back()
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
