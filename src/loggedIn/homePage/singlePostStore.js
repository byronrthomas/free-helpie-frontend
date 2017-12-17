const makeSpecificPostRoute = postId => `/posts/${postId}`

export function singlePostStore (server) {
  return {
    namespaced: true,
    state: {
      postId: null,
      post: null
    },
    getters: {
      postId (state) {
        return state.postId
      },
      post (state) {
        return state.post
      }
    },
    mutations: {
      setPost (state, newDetails) {
        state.post = newDetails
      },
      setPostId (state, newId) {
        state.postId = newId
      }
    },
    actions: {
      getPost ({ commit, rootGetters }, postId) {
        commit('setPostId', postId)
        commit('setLastServerError', '', {root: true})
        server.get(makeSpecificPostRoute(postId), {authToken: rootGetters.authToken})
          .then(resp => commit('setPost', resp.data))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      createPost ({commit, rootGetters}, {post, successCallback}) {
        commit('setLastServerError', '', {root: true})
        server.post('/posts', {authToken: rootGetters.authToken, data: post})
          .then(successCallback)
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      updatePost ({commit, rootGetters, state}, updatedPost) {
        commit('setLastServerError', '', {root: true})
        server.post(makeSpecificPostRoute(state.postId), {authToken: rootGetters.authToken, data: updatedPost})
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      }
    }
  }
}
