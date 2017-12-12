import { postsStore } from './homePage/postsStore'
import { LOCATIONS, SKILLS, CATEGORIES, PROFILE_TEXT_SUGGESTION } from './profileConstants'

function userProfileIsComplete (profile) {
  return profile &&
    profile.personalInfo &&
    profile.helperLocations &&
    profile.helperLocationTypes &&
    profile.helperSkills &&
    profile.helperInterests &&
    profile.helperTimings &&
    profile.helperDescription &&
    profile.helperAgreedToTsAndCs
}

// Within page, state is further split by resource types (REST endpoint paths)
const EMPTY_USER_PROFILE = {
  personalInfo: null,
  helperLocations: [],
  helperLocationTypes: [],
  helperSkills: [],
  helperInterests: [],
  helperDescription: null,
  helperTimings: null,
  helperAgreedToTsAndCs: false
}

function getPageGivenState (state) {
  if (!state.initialised) {
    return 'initialising'
  } else {
    return userProfileIsComplete(state.userProfile)
      ? ''
      : 'profile'
  }
}

function extractUserData (resp) {
  let users = []
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
      favouritePostIds: [],
      possibleLocations: LOCATIONS,
      possibleSkills: SKILLS,
      possibleInterests: CATEGORIES,
      profileTextSuggestion: PROFILE_TEXT_SUGGESTION
    },
    getters: {
      userProfileIsComplete(state) {
        return state.initialised && userProfileIsComplete(state.userProfile)
      },
      favouritePostIds (state) {
        return state.favouritePostIds
      },
      possibleLocations (state) {
        return state.possibleLocations
      },
      possibleSkills (state) {
        return state.possibleSkills
      },
      possibleInterests (state) {
        return state.possibleInterests
      },
      profileTextSuggestion (state) {
        return state.profileTextSuggestion
      }
    },
    mutations: {
      setProfile (state, profileData) {
        state.userProfile = profileData
      },
      setUserId (state, userId) {
        state.userId = userId
      },
      setInitialised (state) {
        state.initialised = true
      },
      favouritePost (state, post) {
        if (!state.favouritePostIds.includes(post.id)) {
          state.favouritePostIds.push(post.id)
        }
      },
      unfavouritePost (state, post) {
        if (state.favouritePostIds.includes(post.id)) {
          state.favouritePostIds = state.favouritePostIds.filter(x => x !== post.id)
        }
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
      updateUserProfile ({ commit, dispatch, rootGetters }, userProfileData) {
        commit('setLastServerError', '', { root: true })
        // Just simulate this one for now
        server.post('/users?token=' + rootGetters.authToken, userProfileData)
          .then(() => dispatch('initialise'))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      favouritePost ({ commit }, post) {
        commit('favouritePost', post)
      },
      unfavouritePost ({ commit }, post) {
        commit('unfavouritePost', post)
      }
    },
    modules: {
      latestposts: postsStore(server)
    }
  }
}
