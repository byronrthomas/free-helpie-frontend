import { postsStore } from './homePage/postsStore'
import { singlePostStore } from './homePage/singlePostStore'
import { LOCATIONS, SKILLS, INTERESTS, PROFILE_TEXT_SUGGESTION } from './profileConstants'
import { singleMailThreadStore } from './homePage/mailThreadStore'
import { activeMailThreadStore } from './homePage/activeMailThreadStore'
import { userInfoStore } from './homePage/userInfoStore'

function userProfileIsComplete (profile) {
  return profile &&
    profile.personalInfo &&
    profile.locations &&
    profile.locationTypes &&
    profile.skills &&
    profile.interests &&
    profile.description &&
    profile.timings &&
    profile.agreedToTsAndCs
}

// Within page, state is further split by resource types (REST endpoint paths)
const EMPTY_USER_PROFILE = {
  personalInfo: null,
  locations: [],
  locationTypes: [],
  skills: [],
  interests: [],
  description: null,
  timings: null,
  agreedToTsAndCs: false
}

function extractUserData (resp) {
  let users = []
  for (let key in resp.data) {
    if (resp.data.hasOwnProperty(key)) {
      const user = {profile: resp.data[key], userId: parseInt(key)}
      users.push(user)
    }
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
      possibleInterests: INTERESTS,
      profileTextSuggestion: PROFILE_TEXT_SUGGESTION
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
      userId (state) {
        return state.userId
      },
      userProfile (state) {
        return state.userProfile
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
      favouritePost ({ state, dispatch }, postId) {
        if (!state.favouritePostIds.includes(postId)) {
          const newFavourites = [...state.favouritePostIds]
          newFavourites.push(postId)
          dispatch('updateFavourites', newFavourites)
        }
      },
      unfavouritePost ({ state, dispatch }, postId) {
        if (state.favouritePostIds.includes(postId)) {
          const newFavourites = state.favouritePostIds.filter(x => x !== postId)
          dispatch('updateFavourites', newFavourites)
        }
      }
    },
    modules: {
      // Using the same implementation as the functionality is the same:
      // GET and cache filtered posts from the server, but using two
      // separate objects so that they're both in memory to avoid latency
      // when navigating back to previously viewed page
      latestposts: postsStore(server),
      savedposts: postsStore(server),
      yourposts: postsStore(server),
      // Ditto for these
      postdetails: singlePostStore(server),
      editpost: singlePostStore(server),

      // Onto mail thread handling
      postthread: singleMailThreadStore(server),

      // mailbox
      activethreads: activeMailThreadStore(server),
      mailboxposts: postsStore(server),
      mailboxusers: userInfoStore(server),

      // mail details
      threaddetails: singleMailThreadStore(server),
      threaddetailsusers: userInfoStore(server)
    }
  }
}
