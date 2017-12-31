import {HOME_COMPONENT_ROUTES} from './homePage/routes'

import EditProfilePage from './EditProfilePage.vue'
import HomePage from './HomePage.vue'
import AccountPage from './AccountPage.vue'

export const LOGGED_IN_ROUTES = [
  {path: 'profile', component: EditProfilePage, name: 'profile'},
  {path: 'account', component: AccountPage, name: 'account'},
  {path: 'home', component: HomePage, name: 'home', children: HOME_COMPONENT_ROUTES}]
