export function singleMailThreadStore (server) {
  return {
    namespaced: true,
    state: {
      mailItems: [],
      threadQuery: {}
    },
    getters: {
      mailItems (state) {
        return state.mailItems
      }
    },
    mutations: {
      setMailItems (state, mailitems) {
        state.mailItems = mailitems
      },
      setThreadQuery (state, threadQuery) {
        state.threadQuery = threadQuery
      }
    },
    actions: {
      refreshMails ({commit, rootGetters, state}) {
        commit('setLastServerError', '', {root: true})
        server.get('/mails', {authToken: rootGetters.authToken, data: state.threadQuery})
          .then(resp => commit('setMailItems', resp.data))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      newMail ({commit, rootGetters, dispatch}, data) {
        commit('setLastServerError', '', {root: true})
        server.post('/mails', {authToken: rootGetters.authToken, data: data})
          .then(() => dispatch('refreshMails'))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      markThreadAsRead ({commit, rootGetters, dispatch}, data) {
        commit('setLastServerError', '', {root: true})
        server.post('/mailReads', {authToken: rootGetters.authToken, data: data})
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      getMailThread ({commit, dispatch}, data) {
        commit('setThreadQuery', data)
        dispatch('refreshMails')
      }
    }
  }
}
