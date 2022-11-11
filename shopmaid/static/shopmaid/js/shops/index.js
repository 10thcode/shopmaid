export default {
  template: `
    <form>
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Search for shops</h2>
        </div>
      </div>

      <!--FORM FIELDS-->
      <div class="fields">
        <div class="field">
          <label>Search: </label>
          <input type="search" ref="search" @input="getResult()" v-model="search" placeholder="e.g. Shopmaid Provisions Shop" maxlength="60">
        </div>
      </div>
    </form>

      <!--SHOPS-->
      <section v-if="shops.length !== 0">
        <!-- TITLE BAR -->
        <div class="title-bar">
          <div class="heading">
            <h2>Shops</h2>
          </div>
        </div>

        <div class="objects">
          <!-- SHOP -->
          <div class="object" v-for="shop in shops" :key="shop.id" @click="$router.push({name: 'shop', params: { id: shop.id }})">
          <div class="thumb">
            <img :src="shop.image"/>
          </div>
          <div class="details">
            <div class="title">
              <p>\${shop.name}</p>
            </div>
            <div class="description">
              <p><i class="fa-solid fa-table-list"></i> \${shop.category}</p>
            </div>
            <div class="description">
              <p><i class="fa-solid fa-map-location-dot"></i> \${shop.address}</p>
            </div>
            <div class="description">
              <p><i class="fa-solid fa-phone-volume"></i> \${shop.phone}</p>
            </div>
          </div>
          </div>
        </div>
      </section>
  `,

  data(){
    return {
      search: '',
      shops: [],
    }
  },

  methods: {
    async getResult(){
      if(this.search !== '') {
        var response = await fetch(`http://localhost:8000/api/searchshops/?search=${this.search}`)
        if(response.ok){
          this.shops = await response.json()
        }else if(response.status === 403){
          this.$router.push('/')
        }else{
          this.$router.push('/error')
        }
      } else {
        this.shops = []
      }
    }
  }
}
