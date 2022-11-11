export default {
  template: `
  <form @submit.prevent="editShop()">
    <!-- TITLE BAR -->
    <div class="title-bar">
      <div class="heading">
        <h2>Edit Description</h2>
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
        <label>Description: </label>
        <input type="text" ref="description" v-model="shop.description" placeholder="e.g. We sell all kinds of goods..." maxlength="720" required>
      </div>
      <div class="field">
        <label>Opens at: </label>
        <input type="time" ref="opens_at" v-model="shop.opens_at" required>
      </div>
      <div class="field">
        <label>Closes at: </label>
        <input type="time" ref="closes_at" v-model="shop.closes_at" required>
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
        var res = await response.json();
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
      formData.append('description', this.shop.description)
      formData.append('opens_at', this.shop.opens_at)
      formData.append('closes_at', this.shop.closes_at)
      formData.append('user', await this.getUser())
      var response = await fetch(`http://localhost:8000/api/shops/${this.shop.id}/`, {
        method: 'put',
        headers: {
          'X-CSRFToken': this.getCookie('csrftoken'),
          'Accept': 'application/json'
        },
        body: formData
      })
      if(response.ok){
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
