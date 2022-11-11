export default {
  template: `
    <form @submit.prevent="editItem()">
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Edit item</h2>
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
          <label>Name: </label>
          <input type="text" ref="name" v-model="item.name" placeholder="e.g. Biscuit" maxlength="120" required>
        </div>

        <div class="field">
          <label>Description: </label>
          <input
            ref="description"
            type="text"
            maxlength="240"
            v-model="item.description"
            placeholder="e.g. Meduim size">
        </div>

        <div class="field">
          <label>Price: </label>
          <input type="number" ref="price" v-model="item.price" placeholder="e.g. 12.34" min="0" step="any" required>
        </div>
      </div>
    </form>
  `,

  data(){
    return {
      item: {
        name: '',
        description: '',
        price: '',
        shop: ''
      },
    }
  },

  async created(){
    await this.getItem()
  },

  methods: {
    async getItem(){
      var response = await fetch(`http://localhost:8000/api/shopitems/${parseInt(this.$route.params.item)}/`)
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

    async editItem(){
      var formData = new FormData()
      formData.append('name', this.item.name)
      formData.append('description', this.item.description)
      if(this.item.price !== '') formData.append('price', this.item.price)
      formData.append('shop', this.item.shop)
      var response = await fetch(`http://localhost:8000/api/shopitems/${parseInt(this.$route.params.item)}/`, {
        method: 'put',
        headers: {
          'X-CSRFToken': this.getCookie('csrftoken'),
          'Accept': 'application/json'
        },
        body: formData
      })
      if(response.ok){
        this.$router.back()
      } else if (response.status === 400){
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
