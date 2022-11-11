export default {
  template: `
    <form @submit.prevent="editQuantity()">
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Edit quantity</h2>
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
          <label>Quantity: </label>
          <input type="number" ref="quantity" v-model="quantity" placeholder="e.g. 12" min="0">
        </div>
      </div>
    </form>
  `,

  data(){
    return {
      quantity: '',
      item: {},
    }
  },

  async created(){
    await this.getCounterItem()
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

    async getCounterItem(){
      var response = await fetch(`http://localhost:8000/api/counteritems/${parseInt(this.$route.params.item)}/`)
      if(response.ok){
        this.item = await response.json()
        this.quantity = this.item.quantity
      }else if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },

    async editQuantity(){
      var formData = new FormData()
      formData.append('quantity', this.quantity)
      formData.append('counter', this.item.counter)
      formData.append('item', this.item.item)
      var response = await fetch(`http://localhost:8000/api/counteritems/${parseInt(this.$route.params.item)}/`, {
        method: 'put',
        headers: {
          'X-CSRFToken': this.getCookie('csrftoken'),
          'Accept': 'application/json'
        },
        body: formData
      })
      if(response.ok){
        this.$router.go(-2)
      }else if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    }
  }
}
