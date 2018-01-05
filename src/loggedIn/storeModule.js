import { postsStore } from './homePage/postsStore'
import { singlePostStore } from './homePage/singlePostStore'
import { LOCATIONS, SKILLS, INTERESTS, PROFILE_TEXT_SUGGESTION } from './profileConstants'
import { singleMailThreadStore } from './homePage/mailThreadStore'
import { activeMailThreadStore } from './homePage/activeMailThreadStore'
import { userInfoStore } from './homePage/userInfoStore'
import { userDetailStore } from './homePage/userDetailStore'
import { userConnectionsStore } from './homePage/userConnectionsStore'

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

export function loggedInStore (server) {
  return {
    namespaced: true,
    // State is split down by page
    state: {
      initialised: false,
      userProfile: null,
      accountDetails: null,
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
      userProfile (state) {
        return state.userProfile
      },
      accountDetails (state) {
        return state.accountDetails
      }
    },
    mutations: {
      setProfile (state, profileData) {
        state.userProfile = profileData
      },
      setInitialised (state) {
        state.initialised = true
      },
      setFavouritePosts (state, favourites) {
        state.favouritePostIds = favourites
      },
      setAccountDetails (state, newDetails) {
        state.accountDetails = newDetails
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
      refreshAccountDetails ({commit, rootGetters, state}) {
        const userId = rootGetters.userId
        if (userId) {
          commit('setLastServerError', '', { root: true })
          server.get(`/accountDetails/${userId}`, {authToken: rootGetters.authToken})
            .then(resp => commit('setAccountDetails', resp.data))
            .catch(err => commit('setLastServerError', err.message, { root: true }))
        }
      },
      initialise ({ commit, getters, rootGetters, dispatch }) {
        commit('setLastServerError', '', { root: true })
        const userId = rootGetters.userId
        server.get(`/users/${userId}/profile`, {authToken: rootGetters.authToken})
          .then(resp => {
            console.log(resp)
            commit('setProfile', resp.data)
            dispatch('getUserFavourites', userId)
          })
          .then(() => dispatch('refreshAccountDetails'))
          .then(() => commit('setInitialised'))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      updateUserProfile ({ commit, dispatch, rootGetters }, userProfileData) {
        const userId = rootGetters.userId
        const postData = {
          authToken: rootGetters.authToken,
          data: userProfileData
        }
        commit('setLastServerError', '', { root: true })
        server.post(`/users/${userId}/profile`, postData)
          .then(() => dispatch('initialise'))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      updateAccountDetails ({ commit, dispatch, state, rootGetters }, accountDetails) {
        commit('setLastServerError', '', { root: true })
        const userId = rootGetters.userId
        server.post(`/accountDetails/${userId}`, {authToken: rootGetters.authToken, data: accountDetails})
          .then(() => dispatch('refreshAccountDetails'))
          .catch(err => commit('setLastServerError', err.message, { root: true }))
      },
      updateFavourites ({ dispatch, commit, rootGetters, state }, newFavourites) {
        commit('setLastServerError', '', { root: true })
        const userId = rootGetters.userId
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
      },
      logout ({commit}) {
        commit('setProfile', null)
        commit('setFavouritePosts', [])
        commit('setInitialised', false)
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
      threaddetailsusers: userInfoStore(server),

      userdetails: userDetailStore(server),

      userconnections: userConnectionsStore(server)
    }
  }
}
