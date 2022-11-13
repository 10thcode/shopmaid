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
        <input type="text" ref="name" v-model="item.name" placeholder="e.g. Shopmaid Buiscuit" maxlength="60" required>
      </div>

      <div class="field">
        <label>Description: </label>
        <input
          ref="description"
          type="text"
          maxlength="120"
          v-model="item.description"
          placeholder="e.g. Meduim size">
      </div>

      <div class="field">
        <label>Price: </label>
        <input type="number" ref="price" v-model="item.price" placeholder="e.g. 12.34" min="0" step="any">
      </div>

      <div class="field">
        <label>Quantity: </label>
        <input type="number" ref="quantity" v-model="item.quantity" placeholder="e.g. 12" min="0">
      </div>
    </div>
  </form>
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

    async getItem(){
      var response = await fetch(`http://localhost:8000/api/listitems/${parseInt(this.$route.params.item)}/`)
      if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      } else if(response.ok){
        this.item = await response.json();
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },

    async editItem(){
      var formData = new FormData();
      formData.append('name', this.item.name)
      formData.append('description', this.item.description)
      formData.append('price', this.item.price === '' ? 0 : this.item.price)
      formData.append('quantity', this.item.quantity === '' ? 0 : this.item.quantity)
      formData.append('list', this.item.list );
      var response = await fetch(`http://localhost:8000/api/listitems/${parseInt(this.$route.params.item)}/`, {
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
      } else if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },
  }
}
