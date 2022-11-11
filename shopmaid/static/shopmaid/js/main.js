import { createApp } from 'vue'
import { createRouter, createWebHashHistory} from 'https://cdn.jsdelivr.net/npm/vue-router@4/dist/vue-router.esm-browser.js'
import header from './components/header.js'
import footer from './components/footer.js'
import home from './components/home.js'
import welcome from './components/welcome.js'

const routes = [
  { path: '/', name:'home', component: home },
  { path: '/welcome', name:'welcome', component: welcome },
  // { path: '/welcome', name:'welcome', component: () => import('./components/welcome.js')},
  { path: '/profile', name:'list-profile', component: () => import('./components/profile.js')},
  { path: '/myshop/profile', name:'shop-profile', component: () => import('./components/shopprofile.js')},
  { path: '/profile/edit', name:'edit-profile', component: () => import('./components/editprofile.js')},

  { path: '/lists', name:'lists', component: () => import('./lists/index.js')},
  { path: '/lists/:id', name:'list', component: () => import('./lists/list.js')},
  { path: '/lists/:id/items/:item', name:'list-item', component: () => import('./lists/listitem.js')},
  { path: '/lists/:id/items/:item/edit', name:'edit-item', component: () => import('./lists/editlistitem.js')},
  { path: '/lists/:id/items/:item/image/edit', name:'edit-list-item-image', component: () => import('./lists/editlistitemimage.js')},
  { path: '/lists/:id/add-item', name:'add-item', component: () => import('./lists/addlistitem.js')},
  { path: '/lists/:id/edit', name:'edit-list', component: () => import('./lists/editlist.js')},
  { path: '/lists/create-list', name:'create-list', component: () => import('./lists/createlist.js')},

  { path: '/shops', name:'shops', component: () => import('./shops/index.js')},
  { path: '/shops/:id', name:'shop', component: () => import('./shops/shop.js')},
  { path: '/shops/:id/items/:item', name:'shop-item', component: () => import('./shops/shopitem.js')},
  { path: '/shops/:id/items/:item/add-to-list', name:'add-to-list', component: () => import('./shops/addtolist.js')},

  { path: '/myshop/manage', name:'shopman', component: () => import('./shop/index.js')},
  { path: '/create-shop', name:'create-shop', component: () => import('./shop/createshop.js')},
  { path: '/myshop/items/:item', name:'shopman-item', component: () => import('./shop/shopitem.js')},
  { path: '/myshop/add-item', name:'add-shop-item', component: () => import('./shop/addshopitem.js')},
  { path: '/myshop/edit', name:'edit-shop', component: () => import('./shop/editshop.js')},
  { path: '/myshop/items/:item/edit', name:'edit-shop-item', component: () => import('./shop/editshopitem.js')},
  { path: '/myshop/about/edit', name:'edit-shop-about', component: () => import('./shop/editabout.js')},
  { path: '/myshop/contact/edit', name:'edit-shop-contact', component: () => import('./shop/editcontact.js')},
  { path: '/myshop/location/edit', name:'edit-shop-location', component: () => import('./shop/editlocation.js')},
  { path: '/myshop/gallery/edit', name:'edit-shop-gallery', component: () => import('./shop/editgallery.js')},
  { path: '/myshop/counter', name:'counter', component: () => import('./counter/index.js')},
  { path: '/myshop/counter/items/:item', name:'counter-item', component: () => import('./counter/counteritem.js')},
  { path: '/myshop/counter/items/:item/edit-quantity', name:'edit-item-quantity', component: () => import('./counter/edititemquantity.js')},
  { path: '/myshop/counter/:counter/add-unsaved-item', name:'add-unsaved-item', component: () => import('./counter/addunsaveditem.js')},
  { path: '/myshop/counter/:counter/search-item', name:'search-item', component: () => import('./counter/shopitems.js')},
  { path: '/myshop/counter/:counter/search-item/:item', name:'add-to-counter', component: () => import('./counter/addtocounter.js')},
  { path: '/myshop/items/:item/image/edit', name:'edit-shop-item-image', component: () => import('./shop/editshopitemimage.js')},

  { path: '/myshop/sales', name:'sales', component: () => import('./sales/index.js')},
  { path: '/myshop/sales/:date/:month/:year', name:'date-sales', component: () => import('./sales/sales.js')},
  { path: '/myshop/sales/:date/:month/:year/buyers/:buyer', name:'buyer', component: () => import('./sales/buyer.js')},
  { path: '/myshop/sales/:date/:month/buyers/:buyer/items/:item', name:'buyer-item', component: () => import('./sales/buyeritem.js')},

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('./components/404.js') },
  { path: '/error', name: 'error', component: () => import('./components/error.js') },
]


const router = createRouter({
  history: createWebHashHistory(),

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },

  routes,
})

const app = createApp ({
  components: {
    'page-header': header,
    'page-footer': footer,
    'home': home,
    'welcome': welcome,
  },

  data(){
      return {
      }
  },

})
app.use(router)
app.config.compilerOptions.delimiters = ['${', '}']
app.mount('#app')
