import {HOME_COMPONENT_ROUTES} from './homePage/routes'
import CreatePostPage from './CreatePostPage.vue'
import {HELP_OFFERED, HELP_WANTED} from './homePage/postTypes'

import EditProfilePage from './EditProfilePage.vue'
import HomePage from './HomePage.vue'
import EditAccountPage from './EditAccountPage.vue'

export const LOGGED_IN_ROUTES = [
  {path: 'profile', component: EditProfilePage, name: 'profile'},
  {path: 'account', component: EditAccountPage, name: 'account'},
  {path: 'offerHelp', component: CreatePostPage, name: 'offerHelp', props: {postType: HELP_OFFERED}},
  {path: 'seekHelp', component: CreatePostPage, name: 'seekHelp', props: {postType: HELP_WANTED}},
  {path: 'home', component: HomePage, name: 'home', children: HOME_COMPONENT_ROUTES}]
