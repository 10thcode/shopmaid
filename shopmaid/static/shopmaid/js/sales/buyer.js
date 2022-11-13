export default {
  template: `
    <!-- TITLE BAR -->
    <div class="title-bar">
      <div class="heading">
        <h2>Buyer</h2>
      </div>
    </div>

    <!--BUYER DETAILS-->
    <div class="overview">
      <div class="title">
        <p>\${buyer.customer_name}</p>
      </div>
      <div class="content">
        <p>\${buyer.additional_info || 'No additional info'}</p>
      </div>
      <div class="amount">
        <p>\${getTotal.toFixed(2)}</p>
      </div>
    </div>

    <!--ITEMS-->
    <section>
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Items</h2>
        </div>
      </div>

      <div class="objects">
        <!-- ITEM -->
        <div
          class="object"
          v-for="item in items"
          :key="item.id"
          @click="$router.push({
            name: 'buyer-item',
            params: {
              item: item.id,
            },
          })"
        >
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
              <p>\${item.quantity === 0 ? (item.price + 0).toFixed(2) : (item.quantity * item.price).toFixed(2)}</p>
            </div>
            <div class="quantity" v-if="item.quantity !== 0">
              <p>Quantity: \${item.quantity} <span v-if="item.price">| Unit Price: \${item.price.toFixed(2)}</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,

  data(){
    return {
      buyer: {},
      items: []
    }
  },

  async created(){
    await this.getBuyer()
    await this.getItems()
  },

  methods: {
    async getBuyer(){
      var response = await fetch(`http://localhost:8000/api/counters/${parseInt(this.$route.params.buyer)}/`)
      this.buyer = await response.json();
    },

    async getItems(){
      var response = await fetch(`http://localhost:8000/api/counteritems/?counter=${parseInt(this.$route.params.buyer)}`)
      this.items = await response.json()
      for (var item in this.items){
        var object = await fetch(`http://localhost:8000/api/shopitems/${this.items[item].item}/`)
        var shopitem = await object.json()
        this.items[item].name = shopitem.name
        this.items[item].image = shopitem.image
        this.items[item].description = shopitem.description
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
