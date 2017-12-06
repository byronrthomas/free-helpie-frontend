function userProfileIsComplete (profile) {
  return profile 
    && profile.personalInfo
    && profile.helperLocations
    && profile.helperLocationTypes
    && profile.helperSkills
    && profile.helperCategories
    && profile.helperTimings
    && profile.helperDescription
    && profile.helperAgreedToTsAndCs
} 

// Within page, state is further split by resource types (REST endpoint paths)
const EMPTY_USER_PROFILE = {
  personalInfo: null,
  helperLocations: [],
  helperLocationTypes: [],
  helperSkills: [],
  helperCategories: [],
  helperDescription: null,
  helperTimings: null,
  helperAgreedToTsAndCs: false
}

function getPageGivenState(state) {
  if (!state.initialised) {
    return 'initialising'
  } else {
    return userProfileIsComplete(state.userProfile)
      ? ''
      : 'profile'
  }
}

function extractUserData (resp) {
  let users = [];
  for (let key in resp.data) {
    const user = {profile: resp.data[key], userId: key}
    users.push(user)
  }
  if (users.length === 0) {
    return EMPTY_USER_PROFILE
  } else {
    return users[0]
  }
}

export function loggedInStore (server) {
  return {
    namespaced: true,
    // State is split down by page 
    state: { 
      initialised: false,
      userProfile: null,
      userId: null,
      currentPage: 'home'
    },
    getters: {
      currentPage (state) {
        const derivedPage = getPageGivenState(state) 
        return derivedPage 
          ? derivedPage 
          : state.currentPage
      }
    },
    mutations: {
      setPage (state, newPage) {
        state.currentPage = newPage
      },
      setProfile (state, profileData) {
        state.userProfile = profileData
      },
      setUserId (state, userId) {
        state.userId = userId
      },
      setInitialised(state) {
        state.initialised = true
      }
    },
    actions: {
      initialise ({ commit, rootGetters }) {
        commit('setLastServerError', '', { root: true })
        server.get('/users?token=' + rootGetters.authToken)
          .then(resp => {
            console.log(resp)
            const {userId, profile} = extractUserData(resp) 
            commit('setProfile', profile)
            commit('setUserId', userId)
            commit('setInitialised')
          }).catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      setPage ({ commit }, payload) {
        commit('setPage', payload)
      },
      updateUserProfile({ commit, dispatch, rootGetters }, userProfileData) {
        commit('setLastServerError', '', { root: true })
        // Just simulate this one for now
        server.post('/users?token=' + rootGetters.authToken, userProfileData)
          .then(() => dispatch('initialise'))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      }
    }
  }
}
