import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import {notLoggedInStore} from '../notLoggedIn/storeModule'

export function store(server) {
    return new Vuex.Store({
        modules: {
            notloggedin: notLoggedInStore(server)
        },
        state: {
            userState: null
        },
        getters: {
            isLoggedIn: state => {
                return state.userState;
            },
            username: state => {
                return state.userState == null ?
                    '' : state.userState.username;
            },
        },
        mutations: {
            setUser(state, payload) {
                state.userState = payload;
            }
        },
        actions: {
            authUser({commit}, payload) {
                server
                    .get('/users', payload)
                    .then(resp => commit('setUser', payload))
                    .catch(err => alert(err));
            },
            // TBH: this would have to be handled server-side
            // without client app being involved
            userVerificationReceived({commit}, payload) {
                server
                    .post('/userVerification', payload)
                    .catch(err => alert(err))
            }
        }
    });
}
