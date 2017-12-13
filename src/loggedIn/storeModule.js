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

function reformatPostResp (resp) {
  const postsObject = {}
  postsObject[resp.data.id] = resp.data
  return postsObject
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
      profileTextSuggestion: PROFILE_TEXT_SUGGESTION,
      postDetails: {}
    },
    getters: {
      userProfileIsComplete (state) {
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
      },
      postDetails (state) {
        return state.postDetails
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
      setFavouritePosts (state, favourites) {
        state.favouritePostIds = favourites
      },
      setPostDetails (state, postData) {
        state.postDetails = postData
      }
    },
    actions: {
      getUserFavourites ({ commit, rootGetters }, userId) {
        if (!userId) return

        commit('setLastServerError', '', { root: true })
        server.get(`/users/${userId}/favourites`, {authToken: rootGetters.authToken})
          .then(resp => {
            console.log(resp)
            commit('setFavouritePosts', resp.data)
          })
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      initialise ({ commit, getters, rootGetters, dispatch }) {
        commit('setLastServerError', '', { root: true })
        server.get('/users?token=' + rootGetters.authToken)
          .then(resp => {
            console.log(resp)
            const {userId, profile} = extractUserData(resp)
            commit('setProfile', profile)
            commit('setUserId', userId)
            dispatch('getUserFavourites', userId)
          })
          .then(() => commit('setInitialised'))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      updateUserProfile ({ commit, dispatch, rootGetters }, userProfileData) {
        commit('setLastServerError', '', { root: true })
        // Just simulate this one for now
        server.post('/users?token=' + rootGetters.authToken, userProfileData)
          .then(() => dispatch('initialise'))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      updateFavourites ({ dispatch, commit, rootGetters, state }, newFavourites) {
        commit('setLastServerError', '', { root: true })
        const userId = state.userId
        const postData = {
          authToken: rootGetters.authToken,
          data: newFavourites
        }
        server.post(`/users/${userId}/favourites`, postData)
          .then(() => { console.log('Success'); dispatch('getUserFavourites', userId) })
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      favouritePost ({ state, dispatch }, post) {
        if (!state.favouritePostIds.includes(post.id)) {
          const newFavourites = [...state.favouritePostIds]
          newFavourites.push(post.id)
          dispatch('updateFavourites', newFavourites)
        }
      },
      unfavouritePost ({ state, dispatch }, post) {
        if (state.favouritePostIds.includes(post.id)) {
          const newFavourites = state.favouritePostIds.filter(x => x !== post.id)
          dispatch('updateFavourites', newFavourites)
        }
      },
      getPost ({ commit, rootGetters }, postId) {
        commit('setLastServerError', '', {root: true})
        server.get('/posts/' + postId, {authToken: rootGetters.authToken})
          .then(resp => commit('setPostDetails', reformatPostResp(resp)))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      }
    },
    modules: {
      latestposts: postsStore(server)
    }
  }
}
