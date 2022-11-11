export default {
  template: `
    <form @submit.prevent="addToList()">
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Add to list</h2>
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
          <label>List: </label>
          <select ref='list' v-model="list" required>
            <option v-for="list in lists" :value="list.id">
              \${ list.title }
            </option>
          </select>
        </div>

        <div class="field">
          <label>Quantity: </label>
          <input ref="quantity" type="number" v-model="quantity" placeholder="e.g. 12">
        </div>
      </div>
    </form>
  `,

  data(){
    return {
      item: {},
      quantity: '',
      list: '',
      lists: [],
    }
  },

  async created (){
    await this.getLists()
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

    async getLists(){
      var response = await fetch('http://localhost:8000/api/lists/')
      if(response.ok){
        this.lists = await response.json();
      }else if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },

    async getImage(){
      var response = await fetch(this.item.image)
      var blob = await response.blob()
      var image = new File([blob], 'image.jpeg', {
        type: blob.type,
      });
      return image
    },

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

    async addToList(){
      var formData = new FormData()
      formData.append('name', this.item.name)
      formData.append('description', this.item.description)
      if(this.quantity !== '') formData.append('quantity', this.quantity)
      formData.append('price', this.item.price)
      formData.append('image', await this.getImage())
      formData.append('list', this.list)
      var response = await fetch('http://localhost:8000/api/listitems/', {
        method: 'post',
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
  },
}
