import {HOME_COMPONENT_ROUTES} from './homePage/routes'

import HelperProfile from './HelperProfile.vue'
import HomePage from './HomePage.vue'

export const LOGGED_IN_ROUTES = [
  {path: 'profile', component: HelperProfile, name: 'profile'},
  {path: 'home', component: HomePage, name: 'home', children: HOME_COMPONENT_ROUTES}]
