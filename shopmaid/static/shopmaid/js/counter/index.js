export default{
  template:`
    <form @submit.prevent="makeSales()">
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading" @click="showFields = showFields === false ? true : false">
          <h2>Counter</h2>
        </div>
        <div class="buttons">
          <button class="reset" type="reset" @click="reset()">
            <i class="fa-solid fa-rotate-left"></i>
          </button>
          <button class="done" type="submit">
            <i class="fa-solid fa-check"></i>
          </button>
        </div>
      </div>

      <!--FORM FIELDS-->
      <div class="fields" v-show="showFields">
        <div class="field">
          <label>Customer name: </label>
          <input type="text" ref="customer_name" v-model="customer_name" placeholder="e.g. John Doe" maxlength="120">
        </div>

        <div class="field">
          <label>Additional info: </label>
          <input
            ref="additional_info"
            type="text"
            maxlength="240"
            v-model="additional_info"
            placeholder="e.g. New customer ...">
          </div>
      </div>
    </form>

    <!--Counter DETAILS-->
    <div class="overview">
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
          <button class="add" @click="$router.push({name: 'add-unsaved-item', params: { counter: counter }})">
            <i class="fa-solid fa-plus"></i>
          </button>
          <button class="add" @click="$router.push({name: 'search-item', params: { counter: counter }})">
            <i class="fa-solid fa-store"></i>
          </button>
        </div>
      </div>

      <div class="objects" v-if="items.length !== 0">
        <!-- ITEM -->
        <div class="object" v-for="item in items" :key="item.id" @click="$router.push({name: 'counter-item', params: { item: item.id }})">
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
          <p class="title">NO ITEM IS ADDED</p>
          <p class="info">Click on the plus(+) icon to add unsaved item to counter.</p>
          <p class="info">Or, click on the store icon to add item from your store to counter.</p>
        </div>
      </div>
    </section>
  `,

  data(){
    return{
      additional_info: '',
      customer_name: '',
      counter: '',
      items: [],

      showFields: false,
    }
  },

  async created(){
    await this.getCounter()
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

    async reset(){
      for(var item in this.items){
        var response = await fetch(`http://localhost:8000/api/counteritems/${this.items[item].id}/`, {
          method: 'delete',
          headers: {
            'X-CSRFToken': this.getCookie('csrftoken'),
            'Accept': 'application/json'
          }
        })
      }
      this.items = []
    },

    async makeSales(){
      var d = new Date()
      var date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      var formData = new FormData()
      formData.append('date', date)
      formData.append('amount', this.getTotal)
      formData.append('shop', await this.getShop())
      var response = await fetch('http://localhost:8000/api/sales/',{
        method: 'post',
        headers: {
          'X-CSRFToken': this.getCookie('csrftoken'),
          'Accept': 'application/json'
        },
        body: formData
      })
      if(response.ok){
        await this.completeCounter()
        await this.getCounter()
      }else if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },

    async completeCounter(){
      var formData = new FormData()
      if (this.customer_name !== '') formData.append('customer_name', this.customer_name)
      if (this.additional_info !== '') formData.append('additional_info', this.additional_info)
      formData.append('completed', true)
      formData.append('shop', await this.getShop())
      var response = await fetch(`http://localhost:8000/api/counters/${this.counter}/`, {
        method: 'put',
        headers: {
          'X-CSRFToken': this.getCookie('csrftoken'),
          'Accept': 'application/json'
        },
        body: formData
      })
      if(response.ok){
        this.customer_name = ""
        this.additional_info = ""
        this.showFields = false
      }else if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },

    async getCounterItems(){
      var response = await fetch(`http://localhost:8000/api/counteritems/?counter=${this.counter}`)
      if(response.ok){
        this.items = await response.json()
        for (var item in this.items){
          var object = await fetch(`http://localhost:8000/api/shopitems/${this.items[item].item}/`)
          var shopitem = await object.json()
          this.items[item].name = shopitem.name
          this.items[item].image = shopitem.image
          this.items[item].description = shopitem.description
        }
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
        var shop = await response.json();
        return shop[0].id
      }else if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },

    async getCounter(){
      var response = await fetch('http://localhost:8000/api/counters/?completed=false')
      if(response.ok){
        var result = await response.json()
        if(result.length === 1){
          this.counter = result[0].id
          await this.getCounterItems()
        } else if(result.length === 0){
          var formData = new FormData()
          formData.append('shop', await this.getShop())
          var new_response = await fetch('http://localhost:8000/api/counters/', {
            method: 'post',
            headers: {
              'X-CSRFToken': this.getCookie('csrftoken'),
              'Accept': 'application/json'
            },
            body: formData
          })
          if(response.ok){
            await this.getCounter();
          }else if(response.status === 404){
            this.$router.push({name: 'NotFound'})
          }else if(response.status === 403){
            this.$router.push('/')
          }else{
            this.$router.push('/error')
          }
        }
      }else if(response.status === 404){
        this.$router.push({name: 'NotFound'})
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
      for (var item in this.items){
        amount += this.items[item].quantity !== 0 ? (this.items[item].price * this.items[item].quantity) : this.items[item].price
      }
      return amount
    }
  }
}
