export default {
  template: `
  <form @submit.prevent="editShop()">
    <!-- TITLE BAR -->
    <div class="title-bar">
      <div class="heading">
        <h2>Edit Gallery</h2>
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
        <label>Image: </label>
        <input type="file" ref="image" @change="selectImage" required>
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
    selectImage(event){
      this.shop.image = event.target.files[0]
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

    async getShop(){
      var response = await fetch('http://localhost:8000/api/shops')
      var res = await response.json()
      this.shop = res[0]
    },

    async getUser(){
      var response = await fetch('http://localhost:8000/api/user')
      var user = await response.json();
      return user.user
    },

    async editShop(){
      var formData = new FormData();
      formData.append('image', this.shop.image)
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
      }
    },
  }
}
