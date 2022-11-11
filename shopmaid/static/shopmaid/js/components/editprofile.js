export default {
  template: `
  <form @submit.prevent="editProfile()">
    <!-- TITLE BAR -->
    <div class="title-bar">
      <div class="heading">
        <h2>Edit Profile</h2>
      </div>
      <div class="buttons">
        <button class="done" type="submit">
          <i class="fa-solid fa-check"></i>
        </button>
      </div>
    </div>

    <!--FORM FIELDS-->
    <div class="fields">
      <div class="field">
        <label>First Name: </label>
        <input type="text" ref="first_name" v-model="profile.firstname" placeholder="e.g. John" required>
      </div>
      <div class="field">
        <label>Last Name: </label>
        <input type="text" ref="last_name" v-model="profile.lastname" placeholder="e.g. Doe" required>
      </div>
    </div>
  </form>
  `,

  data(){
    return {
      profile: {}
    }
  },

  async created(){
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
      var user = await response.json();
      this.profile = user
    },

    async editProfile(){
      var formData = new FormData();
      formData.append('first_name', this.profile.firstname)
      formData.append('last_name', this.profile.lastname)
      var response = await fetch('http://localhost:8000/api/user/edit', {
        method: 'put',
        headers: {
          'X-CSRFToken': this.getCookie('csrftoken'),
          'Accept': 'application/json'
        },
        body: formData
      })
      if(response.ok){
        this.$router.back()
      }else if(response.status === 400) {
        var errors = await response.json()
        this.$refs[Object.keys(errors)[0]].setCustomValidity(errors[Object.keys(errors)[0]]);
        this.$refs[Object.keys(errors)[0]].reportValidity();
        this.$refs[Object.keys(errors)[0]].setCustomValidity('');
      }
    },
  }
}
