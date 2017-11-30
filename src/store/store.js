import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export function store(server) {
    return new Vuex.Store({
        state: {
            userState: null
        },
        getters: {
            isLoggedIn: state => {
                return state.userState;
            },
            userName: state => {
                return state.userState.userName;
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
            createUser() {
                
            }
        }
    });
}
