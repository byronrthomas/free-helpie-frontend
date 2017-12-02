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
            userName: state => {
                return state.userState == null ?
                    '' : state.userState.userName;
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
            userVerificationReceived({commit}, payload) {
                // TODO
            }
        }
    });
}
