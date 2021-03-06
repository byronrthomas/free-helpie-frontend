import {LOGGED_IN_ROUTES} from './loggedIn/routes'
import LoggedInApp from './loggedIn/App.vue'

// import {NOTLOGGED_IN_ROUTES} from './notLoggedIn/routes'
import NotLoggedInApp from './notLoggedIn/App.vue'
import DummyApp from './DummyApp.vue'

const myRoutes = [
  {path: '/app', component: LoggedInApp, name: 'loggedIn', children: LOGGED_IN_ROUTES},
  {path: '/', component: NotLoggedInApp, name: 'notLoggedIn'},
  {path: '*', redirect: '/'}]

if (process.env.NODE_ENV === 'development') {
  myRoutes.unshift({path: '/dummy', component: DummyApp})
}

export const routes = myRoutes
