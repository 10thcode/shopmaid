export default {
  template: `
    <form @submit.prevent="addItem()">
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Add new item</h2>
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
          <input type="text" ref="name" v-model="item.name" placeholder="e.g. Sneaker" maxlength="120" required>
        </div>

        <div class="field">
          <label>Description: </label>
          <input
            ref="description"
            type="text"
            maxlength="240"
            v-model="item.description"
            placeholder="e.g. Size: 42">
        </div>

        <div class="field">
          <label>Price: </label>
          <input type="number" ref="price" v-model="item.price" placeholder="e.g. 12.50" min="0" step="any">
        </div>

        <div class="field">
          <label>Quantity: </label>
          <input type="number" ref="quantity" v-model="item.quantity" placeholder="e.g. 12" min="0">
        </div>

        <div class="field">
          <label>Image: </label>
          <input type="file" ref="image" @change="selectImage">
        </div>
      </div>
    </form>
  `,

  data(){
    return {
      item: {
        name: '',
        description: '',
        quantity: '',
        price: '',
        image: '',
      },
    }
  },

  methods: {
    selectImage(event){
      this.item.image = event.target.files[0]
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

    async addItem(){
      var formData = new FormData()
      formData.append('name', this.item.name)
      formData.append('description', this.item.description)
      if(this.item.quantity !== '') formData.append('quantity', this.item.quantity)
      if(this.item.price !== '') formData.append('price', this.item.price)
      if(this.item.image !== '') formData.append('image', this.item.image)
      formData.append('list', parseInt(this.$route.params.id))
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
      }if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },
  }
}
