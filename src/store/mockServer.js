import { UserAuthServer } from './mockServer/userAuthServer'
import { UserDataServer } from './mockServer/userDataServer'
import { PostsServer } from './mockServer/postsServer'
import { UserFavouritesServer } from './mockServer/userFavouritesServer'

const MOCK_NETWORK_LATENCY = 500
function wrapAsPromise (func, data) {
  return new Promise(
    (resolve, reject) => {
      setTimeout(
        () => func(data, resolve, reject),
        MOCK_NETWORK_LATENCY)
    })
}

const USER_PATH_REG_EXP = RegExp(/^\/users\/(\d+)\/favourites$/)
function Server (userAuth, userData, posts, userFavourites) {
  return {
    get (resourcePath, data) {
      if (resourcePath === '/accounts') {
        return wrapAsPromise(userAuth.get, data)
      }
      if (resourcePath.startsWith('/users?token=')) {
        return wrapAsPromise(userData.get, resourcePath.substring('/users?token='.length))
      }
      if (resourcePath.startsWith('/posts/')) {
        const postId = resourcePath.substring('/posts/'.length)
        return wrapAsPromise(posts.getSingle, {postId: postId, ...data})
      }
      if (resourcePath === '/posts') {
        return wrapAsPromise(posts.get, data)
      }
      const matchToUsersPath = resourcePath.match(USER_PATH_REG_EXP)
      if (matchToUsersPath != null) {
        return wrapAsPromise(userFavourites.get, {userId: matchToUsersPath[1], ...data})
      }
      throw new Error(`Unknown route: GET ${resourcePath}`)
    },
    post (resourcePath, data) {
      if (resourcePath === '/accounts') {
        return wrapAsPromise(userAuth.postUser, data)
      }
      if (resourcePath === '/accountVerification') {
        return wrapAsPromise(userAuth.postVerification, data)
      }
      if (resourcePath.startsWith('/users?token=')) {
        return wrapAsPromise(
          userData.post,
          {token: resourcePath.substring('/users?token='.length), data: data})
      }
      const matchToUsersPath = resourcePath.match(USER_PATH_REG_EXP)
      if (matchToUsersPath != null) {
        return wrapAsPromise(userFavourites.post, {userId: matchToUsersPath[1], ...data})
      }
      throw new Error(`Unknown route: POST ${resourcePath}`)
    }
  }
}

const auther = new UserAuthServer()
export const mockServer = new Server(
  auther,
  new UserDataServer(auther),
  new PostsServer(auther),
  new UserFavouritesServer(auther))
