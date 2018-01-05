import { rootGetters } from "../../store/store";


function recordsDiff (input, toRemove) {
  const toRem = new Set(toRemove.map(rec => rec.otherUser))
  const result = []
  for (const inputElem of input) {
    if (!toRem.has(inputElem.otherUser)) {
      result.push(inputElem)
    }
  }
  return result
}

export function userConnectionsStore (server) {
  return {
    namespaced: true,
    state: {
      connectionInvitesFromMe: [],
      connectionInvitesToMe: [],
      userId: null,
      initailised: false
    },
    getters: {
      connectionInvitesFromMe (state) {
        return state.connectionInvitesFromMe
      },
      connectionInvitesToMe (state) {
        return state.connectionInvitesToMe
      },
      activeConnections (state) {
        const to = new Map(state.connectionInvitesToMe.map(rec => [rec.otherUser, rec]))
        const result = []
        for (const fromMe of state.connectionInvitesFromMe) {
          if (to.has(fromMe.otherUser)) {
            const toMe = to.get(fromMe.otherUser)
            const latest =
              toMe.inviteSent.getTime() > fromMe.inviteSent.getTime()
              ? toMe
              : fromMe
            latest.relatedToPostId =
              typeof latest.relatedToPostId === 'undefined'
                ? (toMe.relatedToPostId || fromMe.relatedToPostId)
                : latest.relatedToPostId
            result.push(latest)
          }
        }
        return result
      },
      pendingInvitesToMe (state) {
        return recordsDiff(state.connectionInvitesToMe, state.connectionInvitesFromMe)
      },
      pendingInvitesFromMe (state) {
        return recordsDiff(state.connectionInvitesFromMe, state.connectionInvitesToMe)
      }
    },
    mutations: {
      setUserId (state, userId) {
        state.userId = userId
      },
      setConnectionsInvitesFromMe (state, connectionInvitesFromMe) {
        state.connectionInvitesFromMe = connectionInvitesFromMe
      },
      setConnectionsInvitesToMe (state, connectionInvitesToMe) {
        state.connectionInvitesToMe = connectionInvitesToMe
      },
      setInitialised (state, newValue) {
        state.initailised = newValue
      }
    },
    actions: {
      refreshFromMe ({commit, state, rootGetters}) {
        const userId = rootGetters.userId
        if (typeof userId !== 'undefined') {
          commit('setLastServerError', '', {root: true})
          server.get(`/users/${userId}/connectionInvitesFromMe`, {authToken: rootGetters.authToken})
            .then(resp => { commit('setConnectionsInvitesFromMe', resp.data) })
            .catch(err => commit('setLastServerError', err.message, { root: true }))
        }
      },
      refreshToMe ({commit, state, rootGetters}) {
        const userId = rootGetters.userId
        if (typeof userId !== 'undefined') {
          commit('setLastServerError', '', {root: true})
          server.get(`/users/${userId}/connectionInvitesToMe`, {authToken: rootGetters.authToken})
            .then(resp => { commit('setConnectionsInvitesToMe', resp.data) })
            .catch(err => commit('setLastServerError', err.message, { root: true }))
        }
      },
      ensureInitialised ({commit, dispatch, state}) {
        if (!state.initailised) {
          dispatch('refreshFromMe')
          .then(() => dispatch('refreshToMe'))
          .then(() => commit('setInitialised', true))
        }
      },
      cancelConnection ({commit, dispatch, rootGetters, state}, invitedUserId) {
        commit('setLastServerError', '', {root: true})
        const userId = rootGetters.userId
        server.delete(`/users/${userId}/connectionInvitesFromMe/${invitedUserId}`, {authToken: rootGetters.authToken})
          .then(() => dispatch('refreshFromMe'))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      inviteConnection ({commit, dispatch, rootGetters, state}, payload) {
        commit('setLastServerError', '', {root: true})
        const userId = rootGetters.userId
        const data = {invitedUserId: payload.otherUser, relatedToPostId: payload.relatedToPostId}
        const req = {authToken: rootGetters.authToken, data}
        server.post(`/users/${userId}/connectionInvitesFromMe`, req)
          .then(() => dispatch('refreshFromMe'))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      }
    }
  }
}
