export default {
  template: `
    <!-- TITLE BAR -->
    <div class="title-bar">
      <div class="heading">
        <h2>Profile</h2>
      </div>
      <div class="buttons">
        <button class="edit" @click="$router.push({name: 'edit-profile'})">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <a href="http://localhost:8000/accounts/logout/">
          <button class="logout">
            <i class="fa-solid fa-right-from-bracket"></i>
          </button>
        </a>
        <button class="delete" @click="deleteUser()">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>

    <div class="overview">
      <div class="title">
        <p>\${user.firstname} \${user.lastname}</p>
      </div>
      <div class="content">
        <p>\${user.email}</p>
      </div>
    </div>

    <div class="full-object" @click="manageShop()">
      <i class="fa-solid fa-right-left"></i>
      <p>Switch to shop</p>
    </div>
  `,

  data(){
    return {
      user: {},
    }
  },

  async created(){
    await this.getUser()
  },

  methods: {
    async getUser(){
      var response = await fetch(`http://localhost:8000/api/user`)
      if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      } else {
        this.user = await response.json();
      }
    },

    async manageShop(){
      var response = await fetch('http://localhost:8000/api/shops/')
      var shop = await response.json()

      if(shop.length === 0){
        this.$router.push('/create-shop')
      } else {
        this.$router.push('/myshop/manage')
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

    async deleteUser(){
      var response = await fetch(`http://localhost:8000/api/user/delete`, {
        method: 'delete',
        headers: {
          'X-CSRFToken': this.getCookie('csrftoken'),
          'Content-Type': 'application/json'
        },
      })
      if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      } else {
        this.$router.push('/')
      }
    },

  },
}
