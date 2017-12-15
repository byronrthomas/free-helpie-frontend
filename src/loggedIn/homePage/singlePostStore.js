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
        server.get('/posts/' + postId, {authToken: rootGetters.authToken})
          .then(resp => commit('setPost', resp.data))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      }
    }
  }
}
