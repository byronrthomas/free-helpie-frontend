
export function userDetailStore (server) {
  return {
    namespaced: true,
    state: {
      profile: null,
      userId: null,
      details: null
    },
    getters: {
      profile (state) {
        return state.profile
      },
      details (state) {
        return state.details
      }
    },
    mutations: {
      setUserId (state, userId) {
        state.userId = userId
      },
      setProfile (state, profile) {
        state.profile = profile
      },
      setDetails (state, details) {
        state.details = details
      }
    },
    actions: {
      refreshProfile ({commit, state, rootGetters}) {
        const userId = state.userId
        if (typeof userId !== 'undefined') {
          commit('setLastServerError', '', {root: true})
          server.get(`/users/${userId}/profile`, {authToken: rootGetters.authToken})
            .then(resp => { commit('setProfile', resp.data) })
            .catch(err => commit('setLastServerError', err.message, { root: true }))
        }
      },
      refreshDetails ({commit, state, rootGetters}) {
        const userId = state.userId
        if (typeof userId !== 'undefined') {
          commit('setLastServerError', '', {root: true})
          server.get(`/users/${userId}/contactDetails`, {authToken: rootGetters.authToken})
            .then(resp => { commit('setDetails', resp.data) })
        }
      },
      getUser ({commit, dispatch}, userId) {
        commit('setUserId', userId)
        dispatch('refreshProfile').then(dispatch('refreshDetails'))
      }
    }
  }
}
