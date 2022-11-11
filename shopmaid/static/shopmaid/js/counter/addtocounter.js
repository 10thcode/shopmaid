export default {
  template: `
    <form @submit.prevent="addToCounter()">
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Add to counter</h2>
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
    }
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

    async addToCounter(){
      var shopitem = await fetch(`http://localhost:8000/api/shopitems/${parseInt(this.$route.params.item)}/`)
      var item = await shopitem.json()
      var formData = new FormData()
      formData.append('price', item.price)
      formData.append('quantity', this.quantity)
      formData.append('counter', parseInt(this.$route.params.counter))
      formData.append('item', item.id)
      var response = await fetch('http://localhost:8000/api/counteritems/', {
        method: 'post',
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
