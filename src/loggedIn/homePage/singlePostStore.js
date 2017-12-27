const makeSpecificPostRoute = postId => `/posts/${postId}`

export const getters = {
  postId (state) {
    return state.postId
  },
  post (state) {
    return state.post
  },
  profileInfo (state) {
    return state.profileInfo
  }
}

export function singlePostStore (server) {
  return {
    namespaced: true,
    state: {
      postId: null,
      post: null,
      profileInfo: {}
    },
    getters,
    mutations: {
      setPost (state, newDetails) {
        state.post = newDetails
      },
      setPostId (state, newId) {
        state.postId = newId
      },
      setProfileInfo (state, profileInfo) {
        state.profileInfo = profileInfo
      }
    },
    actions: {
      refreshProfileInfo ({state, commit, rootGetters}) {
        console.log('Refresh profile, state.post = ', state.post)
        if (!state.post || !state.post.hasOwnProperty('postedBy')) return

        const idsToFetch = [state.post.postedBy]
        const req = {authToken: rootGetters.authToken, data: {userIds: idsToFetch}}
        commit('setLastServerError', '', { root: true })
        server.get('/userDisplayInfos', req)
          .then(resp => commit('setProfileInfo', resp.data))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      getPost ({ commit, rootGetters, dispatch }, postId) {
        commit('setPostId', postId)
        commit('setLastServerError', '', {root: true})
        server.get(makeSpecificPostRoute(postId), {authToken: rootGetters.authToken})
          .then(resp => { commit('setPost', resp.data); dispatch('refreshProfileInfo') })
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      createPost ({commit, rootGetters}, {post, successCallback}) {
        commit('setLastServerError', '', {root: true})
        server.post('/posts', {authToken: rootGetters.authToken, data: post})
          .then(successCallback)
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      updatePost ({commit, rootGetters, state}, {updatedPost, successCallback}) {
        commit('setLastServerError', '', {root: true})
        server.put(makeSpecificPostRoute(state.postId), {authToken: rootGetters.authToken, data: updatedPost})
          .then(successCallback)
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      deletePost ({commit, rootGetters, state}, {successCallback}) {
        commit('setLastServerError', '', {root: true})
        server.delete(makeSpecificPostRoute(state.postId), {authToken: rootGetters.authToken})
          .then(successCallback)
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      }
    }
  }
}
