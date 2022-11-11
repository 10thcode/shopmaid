export default {
    template: `
      <div class="back"><i @click="$router.back()" class="fa-solid fa-chevron-left"></i></div>
      <div class="menus">
        <router-link to="/lists" v-if="$router.currentRoute.value.path.startsWith('/lists') || $router.currentRoute.value.path.startsWith('/shops') || $router.currentRoute.value.path.startsWith('/profile')">
          <div class="menu" :class="{selected : $router.currentRoute.value.path.startsWith('/lists')}">
            <i class="fa-solid fa-list-check"></i>
          </div>
        </router-link>

        <router-link to="/shops" v-if="$router.currentRoute.value.path.startsWith('/lists') || $router.currentRoute.value.path.startsWith('/shops') || $router.currentRoute.value.path.startsWith('/profile')">
          <div class="menu" :class="{selected : $router.currentRoute.value.path.startsWith('/shops')}">
            <i class="fa-solid fa-store"></i>
          </div>
        </router-link>

        <router-link to="/myshop/counter" v-if="$router.currentRoute.value.path.startsWith('/myshop')">
          <div class="menu" :class="{selected : $router.currentRoute.value.path.startsWith('/myshop/counter')}">
            <i class="fa-solid fa-cash-register"></i>
          </div>
        </router-link>

        <router-link to="/myshop/sales" v-if="$router.currentRoute.value.path.startsWith('/myshop')">
          <div class="menu" :class="{selected : $router.currentRoute.value.path.startsWith('/myshop/sales')}">
            <i class="fa-solid fa-chart-simple"></i>
          </div>
        </router-link>

        <router-link to="/myshop/manage" v-if="$router.currentRoute.value.path.startsWith('/myshop')">
          <div class="menu" :class="{selected : $router.currentRoute.value.path.startsWith('/myshop/manage')}">
            <i class="fa-solid fa-shop"></i>
          </div>
        </router-link>

        <!--<router-link to="/" v-if="$router.currentRoute.value.path.startsWith('/myshop')">
          <div class="menu" :class="{selected : $router.currentRoute.value.path.startsWith('/myshop/analysis')}">
            <i class="fa-solid fa-chart-pie"></i>
          </div>
        </router-link>-->

        <router-link to="/profile"
          v-if="
            $router.currentRoute.value.path.startsWith('/shops') || \
            $router.currentRoute.value.path.startsWith('/lists') || \
            $router.currentRoute.value.path.startsWith('/profile')
          "
        >
          <div class="menu" :class="{selected : $router.currentRoute.value.path.startsWith('/profile')}">
            <i class="fa-solid fa-user"></i>
          </div>
        </router-link>

        <router-link to="/myshop/profile"
          v-if="
            $router.currentRoute.value.path.startsWith('/myshop')
          "
        >
          <div class="menu" :class="{selected : $router.currentRoute.value.path.startsWith('/myshop/profile')}">
            <i class="fa-solid fa-user"></i>
          </div>
        </router-link>
      </div>
    `,
}
