export default{
  template: `
    <!-- TITLE BAR -->
    <div class="title-bar">
      <div class="heading">
        <h2>Shop</h2>
      </div>
    </div>

    <!--SHOP DETAILS-->
    <div class="overview">
      <div class="title">
        <p>\${shop.name}</p>
      </div>
      <div class="content">
        <p>\${shop.category}</p>
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

      <div class="objects" v-if="items.length !== 0">
        <!-- ITEM -->
        <div class="object" v-for="item in items" :key="item.id" @click="$router.push({name: 'shop-item', params: { item: item.id }})">
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
              <p>\${(item.price + 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="error" v-else>
        <div class="icon">
          <i class="fa-solid fa-circle-exclamation"></i>
        </div>
        <div class="details">
          <p class="title">SHOP IS EMPTY</p>
          <p class="info">There is no item in this shop.</p>
        </div>
      </div>
    </section>

    <!--ABOUT US-->
    <section v-if="shop.description">
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>About us</h2>
        </div>
      </div>


      <div class="overview">
        <div class="content">
          <p><i class="fa-solid fa-info"></i> &nbsp \${shop.description}</p>
        </div>
        <div class="content">
          <p style="font-family: 'Roboto Mono', monospace;"><i class="fa-solid fa-door-open"></i> \${shop.opens_at}</p>
        </div>
        <div class="content">
          <p style="font-family: 'Roboto Mono', monospace;"><i class="fa-solid fa-door-closed"></i> \${shop.closes_at}</p>
        </div>
      </div>
    </section>

    <!--CONTACT US-->
    <section v-if="shop.phone || shop.email">
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Contact us</h2>
        </div>
      </div>

      <div class="overview">
        <div class="content" v-if="shop.phone">
          <p style="font-family: 'Roboto Mono', monospace;"><i class="fa-solid fa-phone"></i> <a :href="'tel:' + shop.phone">\${shop.phone}</a></p>
        </div>
        <div class="content" v-if="shop.email">
          <p><i class="fa-solid fa-envelope"></i> &nbsp <a :href="'mailto:' + shop.email"> \${shop.email}</a></p>
        </div>
      </div>
    </section>

    <!--LOCATE US-->
    <section v-if="shop.address">
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Locate us</h2>
        </div>
      </div>

      <div class="overview">
        <div class="content">
          <p><i class="fa-solid fa-map-location-dot"></i> &nbsp \${shop.address}</p>
        </div>
      </div>
    </section>

    <!--GALLERY-->
    <section>
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Gallery</h2>
        </div>
      </div>

      <div class="overview">
        <div class="image">
          <img :src="shop.image"/>
        </div>
      </div>
    </section>
  `,

  data(){
    return {
      shop: {},
      items: []
    }
  },

  async created(){
    await this.getShop()
    await this.getShopItems()
  },

  methods: {
    async getShop(){
      var response = await fetch(`http://localhost:8000/api/searchshops/${parseInt(this.$route.params.id)}/`)
      if(response.ok){
        this.shop = await response.json();
      }else if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },

    async getShopItems(){
      var response = await fetch(`http://localhost:8000/api/searchshopitems/?shop=${parseInt(this.$route.params.id)}`)
      if(response.ok){
        this.items = await response.json()
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
