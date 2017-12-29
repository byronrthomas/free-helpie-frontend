export function userInfoStore (server) {
  return {
    namespaced: true,
    state: {
      userInfo: {}
    },
    getters: {
      userInfo (state) {
        return state.userInfo
      }
    },
    mutations: {
      setUserInfo (state, userInfo) {
        state.userInfo = userInfo
      }
    },
    actions: {
      getUserInfo ({state, commit, rootGetters}, idsToFetch) {
        const req = {authToken: rootGetters.authToken, data: {userIds: idsToFetch}}
        commit('setLastServerError', '', { root: true })
        server.get('/userDisplayInfos', req)
          .then(resp => commit('setUserInfo', resp.data))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      }
    }
  }
}
