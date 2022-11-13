export default {
  template: `
    <!-- TITLE BAR -->
    <div class="title-bar">
      <div class="heading">
        <h2>Item</h2>
      </div>
      <div class="buttons">
        <button class="edit" @click="$router.push({name: 'edit-item-quantity', params: { item: item.id }})">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete" @click="deleteItem()">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>

    <!--ITEM DETAILS-->
    <div class="overview">
      <div class="title">
        <p>\${item.name}</p>
      </div>
      <div class="content">
        <p>\${item.description || 'No description'}</p>
      </div>
      <div class="content">
        <p>Quantity: \${item.quantity}</p>
      </div>
      <div class="content">
        <p>Unit Price: \${(item.price + 0).toFixed(2)}</p>
      </div>
      <div class="amount">
        <p>\${item.quantity === 0 ? (item.price + 0).toFixed(2) : (item.quantity * item.price).toFixed(2)}</p>
      </div>
    </div>

    <section>
      <div class="title-bar">
        <div class="heading">
          <h2>Image</h2>
        </div>
      </div>
      <div class="overview">
        <div class="image">
          <img :src="item.image"/>
        </div>
      </div>
    </section>
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
    async getItem(){
      var response = await fetch(`http://localhost:8000/api/counteritems/${parseInt(this.$route.params.item)}/`)
      this.item = await response.json()
      var object = await fetch(`http://localhost:8000/api/shopitems/${this.item.item}/`)
      var shopitem = await object.json()
      this.item.name = shopitem.name
      this.item.image = shopitem.image
      this.item.description = shopitem.description
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

    async deleteItem(){
      var response = await fetch(`http://localhost:8000/api/counteritems/${parseInt(this.$route.params.item)}/`, {
        method: 'delete',
        headers: {
          'X-CSRFToken': this.getCookie('csrftoken'),
          'Accept': 'application/json'
        },
      })
      this.$router.back()
    },

  }
}
