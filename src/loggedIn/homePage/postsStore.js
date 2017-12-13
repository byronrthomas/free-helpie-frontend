function updateFiltering (state, fieldName, newCriteria) {
  const newFilter = {...state.filter}
  if (newCriteria === null) {
    delete newFilter[fieldName]
  } else {
    newFilter[fieldName] = newCriteria
  }
  state.filter = newFilter
}

export function postsStore (server) {
  return {
    namespaced: true,
    state: {
      posts: [],
      filter: {
      }
    },
    getters: {
      getPosts (state) {
        return state.posts
      },
      isFilteredByInterests (state) {
        return Boolean(state.filter.interestsFilter)
      },
      isFilteredBySkills (state) {
        console.log('current state for isFilteredBySkills')
        console.log(state)
        return Boolean(state.filter.skillsFilter)
      },
      isFilteredByLocations (state) {
        return Boolean(state.filter.locationsFilter)
      },
      isFilteredByPostIds (state) {
        return Boolean(state.filter.postIdsFilter)
      }
    },
    mutations: {
      setPostedByFilter (state, users) {
        updateFiltering(state, 'postedByFilter', users)
      },
      setInterestsFilter (state, interests) {
        updateFiltering(state, 'interestsFilter', interests)
      },
      setSkillsFilter (state, skills) {
        console.log('updating state: ')
        console.log(state)
        console.log('with skills: ')
        console.log(skills)
        updateFiltering(state, 'skillsFilter', skills)
        console.log('state is now: ')
        console.log(state)
      },
      setLocationsFilter (state, locations) {
        updateFiltering(state, 'locationsFilter', locations)
      },
      setPostIdsFilter (state, postIds) {
        updateFiltering(state, 'postIdsFilter', postIds)
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
      setPostIdsFilter ({ commit, dispatch }, postIds) {
        commit('setPostIdsFilter', postIds)
        dispatch('refresh')
      },
      refresh ({ commit, dispatch, rootGetters, state }) {
        commit('setLastServerError', '', { root: true })
        const filter = state.filter
        const req = {authToken: rootGetters.authToken, ...filter}
        server.get('/posts', req)
          .then(resp => commit('setPosts', resp.data))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      }
    }
  }
}
