export default{
  template: `
    <form>
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Sales</h2>
        </div>
      </div>

      <!--FORM FIELDS-->
      <div class="fields">
        <div class="field">
          <label>Select Month: </label>
          <select v-model="month" @change="getSales()">
            <option value="0">January</option>
            <option value="1">February</option>
            <option value="2">March</option>
            <option value="3">April</option>
            <option value="4">May</option>
            <option value="5">June</option>
            <option value="6">July</option>
            <option value="7">August</option>
            <option value="8">September</option>
            <option value="9">October</option>
            <option value="10">November</option>
            <option value="11">December</option>
          </select>
        </div>
        <div class="field">
          <label>Select Year: </label>
          <select v-model="year" @change="getSales()">
            <option v-for="year in YEAR" :value="year">\${year}</option>
          </select>
        </div>
      </div>
    </form>

    <div class="overview">
      <div class="amount">
        <p>\${getTotal.toFixed(2)}</p>
      </div>
    </div>

    <section>
      <!-- TITLE BAR -->
      <div class="title-bar">
        <div class="heading">
          <h2>Dates</h2>
        </div>
      </div>

      <div class="objects">
        <!-- DATE -->
        <div
          class="object"
          v-for="date in dates"
          @click="$router.push({
            name: 'date-sales',
            params: {
              date: date,
              month: getMonth,
              year: year,
            }
          })"
        >
          <div class="thumb">
            <p>\${date}</p>
          </div>
          <div class="details">
            <div class="title">
              <p>\${MONTH[month]}</p>
            </div>
            <div class="description">
              <p>\${year}</p>
            </div>
            <div class="amount">
              <p>\${getDateTotal(date).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,

  data(){
    return{
      month: '',
      year: '',
      dates: [],
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

      YEAR: [],

      sales: []
    }
  },

  async created(){
    var current_date = new Date()
    this.month = current_date.getMonth();
    this.year = current_date.getFullYear();
    await this.getSales()
    this.populateYear()
  },

  methods: {
    async getSales(){
      var response = await fetch(`http://localhost:8000/api/sales/?date__month=${parseInt(this.month) + 1}&date__year=${parseInt(this.year)}`)
      this.sales = await response.json()
      this.dates = []
      for(var sale in this.sales){
        for(var date = 1; date <= 31; date++){
          if(new Date(this.sales[sale].date).getDate() === date){
            if(!this.dates.includes(date)) this.dates.push(date)
          }
        }
      }
    },

    populateYear(){
      const date = new Date();
      const year = date.getFullYear();
      for(var i = 0; i <= 10; i++){
        this.YEAR.push(year - i)
      }
    },

    getDateTotal(date){
      var amount = 0
      for(var sale in this.sales){
        if(new Date(this.sales[sale].date).getDate() === date){
          amount += this.sales[sale].amount
        }
      }
      return amount
    }
  },

  computed: {
    getMonth(){
      return parseInt(this.month) + 1
    },

    getTotal(){
      var amount = 0
      for(var sale in this.sales){
        amount += this.sales[sale].amount
      }
      return amount
    },
  }
}
