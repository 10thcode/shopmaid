export default {
  template: `
    <!-- TITLE BAR -->
    <div class="title-bar">
      <div class="heading">
        <h2>Lists</h2>
      </div>
      <div class="buttons">
        <button class="add" @click="$router.push('/lists/create-list')">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>

    <!--LISTS-->
    <section>
      <div class="objects" v-if="lists.length !== 0">
        <!-- LIST -->
        <div class="object" v-for="list in lists" :key="list.id" @click="$router.push({name: 'list', params: { id: list.id }})">
          <div class="thumb">
            <i class="fa-solid fa-list-ul"></i>
          </div>
          <div class="details">
            <div class="title">
              <p>\${list.title}</p>
            </div>
            <div class="description">
              <p>\${list.description || 'No description'}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="error" v-else>
        <div class="icon">
          <i class="fa-solid fa-circle-exclamation"></i>
        </div>
        <div class="details">
          <p class="title">NO LIST FOUND</p>
          <p class="info">Click on the plus(+) icon to create a list.</p>
        </div>
      </div>
    </section>

  `,

  data(){
    return {
      lists: [],
    }
  },

  async created(){
    await this.getLists()
  },

  methods:{

    async getLists(){
      var response = await fetch('http://localhost:8000/api/lists/')
      if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      } else if (response.ok){
        this.lists = await response.json();
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },
  },

}
