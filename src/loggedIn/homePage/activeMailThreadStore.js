export function activeMailThreadStore (server) {
  return {
    namespaced: true,
    state: {
      activeThreads: []
    },
    getters: {
      activeThreads (state) {
        return state.activeThreads
      }
    },
    mutations: {
      setActiveThreads (state, mailitems) {
        state.activeThreads = mailitems
      }
    },
    actions: {
      refreshThreads ({commit, rootGetters, state}) {
        commit('setLastServerError', '', {root: true})
        server.get('/activeMailThreads', {authToken: rootGetters.authToken})
          .then(resp => commit('setActiveThreads', resp.data))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      }
    }
  }
}
