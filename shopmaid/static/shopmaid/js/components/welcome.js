export default {
  template: `
    <!-- TITLE BAR -->
    <div class="title-bar">
      <div class="heading">
        <h2>Welcome \${user.firstname}!</h2>
      </div>
    </div>

    <div class="error">
      <div class="icon">
        <i class="fa-solid fa-handshake"></i>
      </div>
    </div>

    <div class="overview">
      <div class="title">
        <p>What do you want to do?</p>
      </div>
    </div>

    <div class="small-objects">
      <div class="small-object" @click="$router.push('/lists')">
        <div class="icon">
          <i class="fa-solid fa-list-check"></i>
        </div>
        <div class="text">
          <p>Make a shopping list</p>
        </div>
      </div>
      <div class="small-object" @click="manageShop()">
        <div class="icon">
          <i class="fa-solid fa-shop"></i>
        </div>
        <div class="text">
          <p>Manage my shop</p>
        </div>
      </div>
    </div>
  `,

  data(){
    return{
      user: ''
    }
  },

  async created(){
    await this.getUser()
  },

  // mounted(){
  //   var num = 0
  //   if (num = 0) {
  //     this.$router.go()
  //     var num = 1
  //     console.log(num);
  //   }else{
  //     num = 0
  //   }
  // },

  methods:{
    async getUser(){
      var response = await fetch('http://localhost:8000/api/user')
      this.user = await response.json();
    },

    async manageShop(){
      var response = await fetch('http://localhost:8000/api/shops/')
      var shop = await response.json()

      if(shop.length === 0){
        this.$router.push('/create-shop')
      } else {
        this.$router.push('/myshop/manage')
      }
    }
  }
}
