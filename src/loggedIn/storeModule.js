function userProfileIsComplete (profile) {
  return profile.personalInfo
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
    throw new Error("Cannot do anything with uninitialised state!")
  } else {
    return userProfileIsComplete(state.userProfile)
      ? 'home'
      : 'profile'
  }
}

export function loggedInStore (server) {
  return {
    namespaced: true,
    // State is split down by page 
    state: { 
      initialised: false,
      userProfile: null,
      currentPage: 'initialising'
    },
    getters: {
      currentPage (state) {
        return state.currentPage
      }
    },
    mutations: {
      setPage (state, newPage) {
        state.currentPage = newPage
      },
      setProfile (state, profileData) {
        state.userProfile = profileData
        state.currentPage = getPageGivenState(state)
      },
      setInitialised(state) {
        state.initialised = true
      }
    },
    actions: {
      initialise ({ commit }, payload) {
        // Just simulate this for now
        setTimeout(() => {
          commit('setInitialised')
          commit('setProfile', EMPTY_USER_PROFILE)
        },
        1000)
      },
      setPage ({ commit }, payload) {
        commit('setPage', payload)
      },
      updateUserProfile({ commit }, userProfileData) {
        commit('setLastServerError', '', { root: true })
        // Just simulate this one for now
        setTimeout(() => {
          commit('setProfile', userProfileData)
        }, 2000)
      }
      // createUser ({ commit }, payload) {
      //   commit('setLastServerError', '', { root: true })
      //   server
      //     .post('/users', payload)
      //     .then(() => commit('setAction', 'waitingForEmail'))
      //     .catch(err => commit('setLastServerError', err, { root: true }))
      // }
    }
  }
}
