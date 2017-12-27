function updateFiltering (state, fieldName, newCriteria) {
  const newFilter = {...state.filter}
  if (newCriteria === null) {
    delete newFilter[fieldName]
  } else {
    newFilter[fieldName] = newCriteria
  }
  state.filter = newFilter
}

function mapObjectValuesToArray (mapper, object) {
  const result = []
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      result.push(mapper(object[key]))
    }
  }
  return result
}

export function postsStore (server) {
  return {
    namespaced: true,
    state: {
      posts: {},
      filter: {
      },
      profileInfo: {}
    },
    getters: {
      getPosts (state) {
        return state.posts
      },
      isFilteredByInterests (state) {
        return Boolean(state.filter.interestsFilter)
      },
      isFilteredBySkills (state) {
        return Boolean(state.filter.skillsFilter)
      },
      isFilteredByLocations (state) {
        return Boolean(state.filter.locationsFilter)
      },
      isFilteredByPostIds (state) {
        return Boolean(state.filter.postIdsFilter)
      },
      profileInfo (state) {
        return state.profileInfo
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
        updateFiltering(state, 'skillsFilter', skills)
      },
      setLocationsFilter (state, locations) {
        updateFiltering(state, 'locationsFilter', locations)
      },
      setPostIdsFilter (state, postIds) {
        updateFiltering(state, 'postIdsFilter', postIds)
      },
      setPosts (state, posts) {
        state.posts = posts
      },
      setProfileInfo (state, profileInfo) {
        state.profileInfo = profileInfo
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
      refreshProfileInfo ({state, commit, rootGetters}) {
        const idsToFetch = mapObjectValuesToArray(post => post.postedBy, state.posts)
        const req = {authToken: rootGetters.authToken, data: {userIds: idsToFetch}}
        commit('setLastServerError', '', { root: true })
        server.get('/userDisplayInfos', req)
          .then(resp => commit('setProfileInfo', resp.data))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      refresh ({ commit, dispatch, rootGetters, state }) {
        commit('setLastServerError', '', { root: true })
        const filter = state.filter
        const req = {authToken: rootGetters.authToken, ...filter}
        server.get('/posts', req)
          .then(resp => { commit('setPosts', resp.data); dispatch('refreshProfileInfo') })
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      }
    }
  }
}
