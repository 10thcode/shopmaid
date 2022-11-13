export default{
  template: `
    <!-- TITLE BAR -->
    <div class="title-bar">
      <div class="heading">
        <h2>Date</h2>
      </div>
    </div>

    <!--SALES DETAILS-->
    <div class="overview">
      <div class="title">
        <p>\${day}</p>
      </div>
      <div class="content">
        <p>\${date + " " + month + ',' + " " + year}</p>
      </div>
      <div class="amount">
        <p>\${amount.toFixed(2)}</p>
      </div>
    </div>

    <!--BUYERS-->
    <section>
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Buyers</h2>
        </div>
      </div>

      <div class="objects">
        <!-- Buyer -->
        <div
          class="object"
          v-for="buyer in buyers"
          :key="buyer.id"
          @click="$router.push({
            name: 'buyer',
            params: {
              buyer: buyer.id
            },
          })"

        >
          <div class="thumb">
            <i class="fa-solid fa-basket-shopping"></i>
          </div>
          <div class="details">
            <div class="title">
              <p>\${buyer.customer_name}</p>
            </div>
            <div class="description">
              <p>\${buyer.additional_info || 'No addintional info'}</p>
            </div>
            <div class="amount">
              <p>\${(buyer.amount + 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,

  data(){
    return{
      day: '',
      date: '',
      month: '',
      year: '',
      MONTH: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      DAY: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],

      buyers: [],
      amount: 0

    }
  },

  async created(){
    await this.getDate()
    await this.getAmount()
  },

  methods: {
    async getDate(){
      var d = this.$route.params.year + '-' + this.$route.params.month + "-" + this.$route.params.date
      var date = new Date(d)
      this.day = this.DAY[date.getDay()]
      if(this.$route.params.date.endsWith('1')){
        this.date = this.$route.params.date + 'st'
      } else if(this.$route.params.date.endsWith('2')){
        this.date = this.$route.params.date + 'nd'
      }else{
        this.date = this.$route.params.date + 'th'
      }
      this.month = this.MONTH[date.getMonth()]
      this.year = date.getFullYear()

      var response = await fetch(`http://localhost:8000/api/counters/?completed=true&created_at__month=${this.$route.params.month}&created_at__day=${this.$route.params.date}&created_at__year=${this.$route.params.year}`)
      this.buyers = await response.json()
      for(var buyer in this.buyers){
        var response = await fetch(`http://localhost:8000/api/counteritems/?counter=${this.buyers[buyer].id}`)
        var items = await response.json()
        this.buyers[buyer].amount = 0
        for (var item in items){
          this.buyers[buyer].amount += (items[item].price * items[item].quantity)
        }
      }
    },

    async getItems(){

    },

    async getAmount(){
      var response = await fetch(`http://localhost:8000/api/sales/?date__month=${this.$route.params.month}&date__year=${this.$route.params.year}`)
      var sales = await response.json()
      var amount = 0
      for(var sale in sales){
        if(new Date(sales[sale].date).getDate() === parseInt(this.$route.params.date)){
          amount += sales[sale].amount
        }
      }
      this.amount = amount
    },
  }
}
