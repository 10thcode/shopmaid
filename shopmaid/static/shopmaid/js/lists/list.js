export default {
  template: `
    <!-- TITLE BAR -->
    <div class="title-bar">
      <div class="heading">
        <h2>List</h2>
      </div>
      <div class="buttons">
        <button class="edit" @click="$router.push({name: 'edit-list', params: { id: list.id }})">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete" @click="deleteList()">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>

    <!--LIST DETAILS-->
    <div class="overview">
      <div class="title">
        <p>\${list.title}</p>
      </div>
      <div class="content">
        <p>\${list.description || 'No description'}</p>
      </div>
      <div class="amount">
        <p><i class="fa-solid fa-money-bill-wave"></i> \${getTotal.toFixed(2)}</p>
      </div>
    </div>

    <!--ITEMS-->
    <section>
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Items</h2>
        </div>
        <div class="buttons">
          <button class="add" @click="$router.push({name: 'add-item', params: { id: list.id }})">
            <i class="fa-solid fa-plus"></i>
          </button>
          <button class="check">
            <i class="fa-solid fa-check-double"></i>
          </button>
        </div>
      </div>

      <div class="objects" v-if="listitems.length !== 0">
        <!-- ITEM -->
        <div class="object" v-for="item in listitems" :key="item.id" @click="$router.push({name: 'list-item', params: { item: item.id }})">
          <div class="thumb">
            <img :src="item.image"/>
          </div>
          <div class="details">
            <div class="title">
              <p>\${item.name}</p>
            </div>
            <div class="description">
              <p>\${item.description || 'No description'}</p>
            </div>
            <div class="amount" v-if="item.price !== 0">
              <p><i class="fa-solid fa-money-bill-wave"></i> \${item.quantity === 0 ? (item.price + 0).toFixed(2) : (item.quantity * item.price).toFixed(2)}</p>
            </div>
            <div class="quantity" v-if="item.quantity !== 0">
              <p>Quantity: \${item.quantity} <span v-if="item.price">| Unit Price: \${item.price.toFixed(2)}</span></p>
            </div>
          </div>
        </div>
      </div>

      <div class="error" v-else>
        <div class="icon">
          <i class="fa-solid fa-circle-exclamation"></i>
        </div>
        <div class="details">
          <p class="title">LIST IS EMPTY</p>
          <p class="info">Click on the plus(+) icon to add item to this list.</p>
        </div>
      </div>
    </section>
  `,

  data(){
    return {
      list: {},
      listitems: []
    }
  },

  async created(){
    await this.getList()
    await this.getListItems()
  },

  methods: {
    async getList(){
      var response = await fetch(`http://localhost:8000/api/lists/${parseInt(this.$route.params.id)}/`)
      if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.ok){
        this.list = await response.json();
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },

    async getListItems(){
      var response = await fetch(`http://localhost:8000/api/listitems/?list=${parseInt(this.$route.params.id)}`)
      if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      } else if(response.ok){
        this.listitems = await response.json()
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

    async deleteList(){
      var response = await fetch(`http://localhost:8000/api/lists/${parseInt(this.$route.params.id)}/`, {
        method: 'delete',
        headers: {
          'X-CSRFToken': this.getCookie('csrftoken'),
          'Content-Type': 'application/json'
        },
      })
      if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      } else if(response.ok){
        this.$router.back()
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },

  },

  computed:{
    getTotal(){
      var amount = 0;
      for (var item in this.listitems){
        amount += this.listitems[item].quantity !== 0 ? (this.listitems[item].price * this.listitems[item].quantity) : this.listitems[item].price
      }
      return amount
    }
  }
}
