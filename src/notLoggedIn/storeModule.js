export function notLoggedInStore (server) {
  return {
    namespaced: true,
    state: {currentAction: 'login'},
    getters: {
      currentAction(state) {
        return state.currentAction;
      }
    },
    mutations: {
      setAction(state, payload) {
        state.currentAction = payload;
      }
    },
    actions: {
      setAction({commit}, payload) {
        commit('setAction', payload);
      },
      createUser({commit}, payload) {
        // TODO: fill this in with a proper server call

        commit('setAction', 'waitingForEmail')
      }
    }
  }
}