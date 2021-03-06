export function notLoggedInStore (server) {
  return {
    namespaced: true,
    state: { currentAction: 'login' },
    getters: {
      currentAction (state) {
        return state.currentAction
      }
    },
    mutations: {
      setAction (state, payload) {
        state.currentAction = payload
      }
    },
    actions: {
      setAction ({ commit }, payload) {
        commit('setAction', payload)
      },
      createUser ({ commit }, payload) {
        commit('setLastServerError', '', { root: true })
        server
          .post('/accounts', payload)
          .then(() => commit('setAction', 'waitingForEmail'))
          .catch(err => commit('setLastServerError', err, { root: true }))
      }
    }
  }
}
