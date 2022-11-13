export default{
  template: `
    <!-- TITLE BAR -->
    <div class="title-bar">
      <div class="heading">
        <h2>Shop</h2>
      </div>
      <div class="buttons">
        <button class="edit" @click="$router.push({name: 'edit-shop'})">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete" @click="deleteShop()">
          <i class="fa-solid fa-trash-can"></i>
        </button>
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
        <div class="buttons">
          <button class="add" @click="$router.push({name: 'add-shop-item'})">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>

      <div class="objects" v-if="items.length !== 0">
        <!-- ITEM -->
        <div class="object" v-for="item in items" :key="item.id" @click="$router.push({name: 'shopman-item', params: { item: item.id }})">
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
          <p class="info">Click on the plus(+) icon to add item to shop.</p>
        </div>
      </div>
    </section>

    <!--ABOUT US-->
    <section>
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>About us</h2>
        </div>
        <div class="buttons">
          <button class="edit" @click="$router.push({name: 'edit-shop-about'})">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      </div>


      <div class="overview">
        <div class="content">
          <p><i class="fa-solid fa-info"></i> &nbsp \${shop.description || 'Not provided'}</p>
        </div>
        <div class="content">
          <p style="font-family: 'Roboto Mono', monospace;"><i class="fa-solid fa-door-open"></i> \${shop.opens_at || 'Not provided'}</p>
        </div>
        <div class="content">
          <p style="font-family: 'Roboto Mono', monospace;"><i class="fa-solid fa-door-closed"></i> \${shop.closes_at || 'Not provided'}</p>
        </div>
      </div>
    </section>

    <!--CONTACT US-->
    <section>
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Contact us</h2>
        </div>
        <div class="buttons">
          <button class="edit" @click="$router.push({name: 'edit-shop-contact'})">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      </div>

      <div class="overview">
        <div class="content">
          <p style="font-family: 'Roboto Mono', monospace;"><i class="fa-solid fa-phone"></i> <a :href="'tel:' + shop.phone">\${shop.phone || 'Not provided'}</a></p>
        </div>
        <div class="content">
          <p><i class="fa-solid fa-envelope"></i> &nbsp <a :href="'mailto:' + shop.email"> \${shop.email || 'Not provided'}</a></p>
        </div>
      </div>
    </section>

    <!--LOCATE US-->
    <section>
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Locate us</h2>
        </div>
        <div class="buttons">
          <button class="edit" @click="$router.push({name: 'edit-shop-location'})">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      </div>

      <div class="overview">
        <div class="content">
          <p><i class="fa-solid fa-map-location-dot"></i> &nbsp \${shop.address || 'Not provided'}</p>
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
        <div class="buttons">
          <button class="edit" @click="$router.push({name: 'edit-shop-gallery'})">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
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
      var response = await fetch('http://localhost:8000/api/shops')
      if(response.ok){
        var res = await response.json();
        this.shop = res[0]
      }else if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },

    async getShopItems(){
      var response = await fetch('http://localhost:8000/api/shopitems')
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


    async deleteShop(){
      var response = await fetch(`http://localhost:8000/api/shops/${this.shop.id}/`, {
        method: 'delete',
        headers: {
          'X-CSRFToken': this.getCookie('csrftoken'),
          'Accept': 'application/json'
        },
      })
      if(response.ok){
        this.$router.push('/')
      }else if (response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },
  },
}
