import Vue from 'vue'
import Vuex from 'vuex'

import {notLoggedInStore} from '../notLoggedIn/storeModule'
import {loggedInStore} from '../loggedIn/storeModule'

Vue.use(Vuex)

export function store (server) {
  return new Vuex.Store({
    modules: {
      notloggedin: notLoggedInStore(server),
      loggedin: loggedInStore(server)
    },
    state: {
      userState: null,
      lastServerError: ''
    },
    getters: {
      isLoggedIn: state => {
        return state.userState != null
      },
      username: state => {
        return state.userState == null
          ? ''
          : state.userState.username
      },
      lastServerError: state => {
        return state.lastServerError
      },
      authToken: state => {
        return state.userState == null
          ? ''
          : state.userState.authToken
      }
    },
    mutations: {
      setUser (state, payload) {
        state.userState = payload
      },
      setLastServerError (state, payload) {
        state.lastServerError = payload
      }
    },
    actions: {
      authUser ({commit}, payload) {
        commit('setLastServerError', '')
        server
          .get('/accounts', payload)
          .then(resp => commit('setUser', {authToken: resp.authData, username: payload.username}))
          .catch(err => commit('setLastServerError', err))
      },
      // TBH: this would have to be handled server-side
      // without client app being involved
      userVerificationReceived ({commit}, payload) {
        commit('setLastServerError', '')
        server
          .post('/accountVerification', payload)
          .catch(err => alert(err))
      }
    }
  })
}
