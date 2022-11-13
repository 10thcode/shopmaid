export default {
  template: `
    <form>
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Search for items</h2>
        </div>
      </div>

      <!--FORM FIELDS-->
      <div class="fields">
        <div class="field">
          <label>Search: </label>
          <input type="search" ref="search" @input="getResult()" v-model="search" placeholder="e.g. Biscuit" maxlength="120">
        </div>
      </div>
    </form>

      <!--SHOPS-->
      <section>
        <!-- TITLE BAR -->
        <div class="title-bar">
          <div class="heading">
            <h2>Items</h2>
          </div>
        </div>

        <div class="objects" v-if="items.length !== 0">
          <!-- ITEM -->
          <div class="object" v-for="item in items" :key="item.id" @click="$router.push({name: 'add-to-counter', params: { item: item.id }})">
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
            <p class="title">NO ITEM FOUND</p>
            <p class="info">Add item to your shop first.</p>
          </div>
        </div>
      </section>
  `,

  data(){
    return {
      search: '',
      items: [],
    }
  },

  async created(){
    await this.getResult()
  },

  methods: {
    async getResult(){
      var response = await fetch(`http://localhost:8000/api/searchshopitems/?search=${this.search}`)
      this.items = await response.json()
    }
  }
}
