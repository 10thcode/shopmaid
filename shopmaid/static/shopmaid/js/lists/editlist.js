export default {
  template: `
    <form @submit.prevent="editList()">
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Edit list</h2>
        </div>
        <div class="buttons">
          <button class="cancel" type="button" @click="$router.back()">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <button class="done" type="submit">
            <i class="fa-solid fa-check"></i>
          </button>
        </div>
      </div>

      <!--FORM FIELDS-->
      <div class="fields">
        <div class="field">
          <label>Title: </label>
          <input type="text" ref="title" v-model="list.title" placeholder="e.g. My Shopping List" maxlength="120" required>
        </div>

        <div class="field">
          <label>Description: </label>
          <input
            ref="description"
            type="text"
            maxlength="240"
            v-model="list.description"
            placeholder="e.g. Items I need to buy this weekend.">
          </div>
      </div>
    </form>
  `,

  data(){
    return {
      list: {
        user: '',
      },
    }
  },

  async created(){
    await this.getList()
    await this.getUser()
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
    async getUser(){
      var response = await fetch('http://localhost:8000/api/user')
      if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.ok) {
        var user = await response.json()
        this.list.user = user.user
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },


    async getList(){
      var response = await fetch(`http://localhost:8000/api/lists/${parseInt(this.$route.params.id)}/`)
      if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      } else if (response.ok){
        this.list = await response.json();
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },

    async editList(){
      var response = await fetch(`http://localhost:8000/api/lists/${parseInt(this.$route.params.id)}/`, {
        method: 'put',
        headers: {
          'X-CSRFToken': this.getCookie('csrftoken'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.list)
      })
      if(response.ok){
        this.$router.back()
      } else if (response.status === 400){
        var errors = await response.json()
        this.$refs[Object.keys(errors)[0]].setCustomValidity(errors[Object.keys(errors)[0]]);
        this.$refs[Object.keys(errors)[0]].reportValidity();
        this.$refs[Object.keys(errors)[0]].setCustomValidity('');
      } else if(response.status === 404){
        this.$router.push({name: 'NotFound'})
      }else if(response.status === 403){
        this.$router.push('/')
      }else{
        this.$router.push('/error')
      }
    },
  }
}
