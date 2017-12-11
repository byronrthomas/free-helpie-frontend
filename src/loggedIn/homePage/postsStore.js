export function postsStore (server) {
  return {
    namespaced: true,
    state: {
      posts: [],
      filter: {
        postedByFilter: [],
        interestsFilter: [],
        skillsFilter: [],
        locationsFilter: []
      }
    },
    getters: {
      getPosts (state) {
        return state.posts
      },
      getFilter (state) {
        return state.filter
      },
      isFilteredByInterests (state) {
        return state.filter.interestsFilter.length > 0
      },
      isFilteredBySkills (state) {
        return state.filter.skillsFilter.length > 0
      },
      isFilteredByLocations (state) {
        return state.filter.locationsFilter.length > 0
      }
    },
    mutations: {
      setPostedByFilter (state, users) {
        state.filter.postedByFilter = users
      },
      setInterestsFilter (state, interests) {
        state.filter.interestsFilter = interests
      },
      setSkillsFilter (state, skills) {
        state.filter.skillsFilter = skills
      },
      setLocationsFilter (state, locations) {
        state.filter.locationsFilter = locations
      },
      setPosts (state, posts) {
        state.posts = posts
      }
    },
    actions: {
      setPostedByFilter ({ commit, dispatch }, users) {
        commit('setPostedByFilter', users)
        dispatch('refresh')
      },
      setInterestsFilter ({ commit, dispatch }, interests) {
        commit('setInterestsFilter', interests)
        dispatch('refresh')
      },
      setSkillsFilter ({ commit, dispatch }, skills) {
        commit('setSkillsFilter', skills)
        dispatch('refresh')
      },
      setLocationsFilter ({ commit, dispatch }, locations) {
        commit('setLocationsFilter', locations)
        dispatch('refresh')
      },
      refresh ({ commit, dispatch, rootGetters, getters }) {
        commit('setLastServerError', '', { root: true })
        const filter = getters.getFilter
        const req = {authToken: rootGetters.authToken, ...filter}
        server.get('/posts', req)
          .then(resp => commit('setPosts', resp.data))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      }
    }
  }
}
