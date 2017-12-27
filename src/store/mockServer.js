import { UserAuthServer } from './mockServer/userAuthServer'
import { UserDataServer } from './mockServer/userDataServer'
import { PostsServer } from './mockServer/postsServer'
import { UserFavouritesServer } from './mockServer/userFavouritesServer'
import { MailsServer } from './mockServer/mailsServer'
import { INITIAL_POSTS } from './mockServer/initialPosts'
import { INITIAL_USER_DATA } from './mockServer/initialUserData'
import { runAll } from './mockServer/callbackTools'

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
function Server (userAuth, userData, posts, userFavourites, mails) {
  return {
    get (resourcePath, data) {
      if (resourcePath === '/accounts') {
        return wrapAsPromise(userAuth.get, data)
      }
      if (resourcePath.startsWith('/users?token=')) {
        return wrapAsPromise(userData.get, resourcePath.substring('/users?token='.length))
      }
      if (resourcePath === '/userDisplayInfos') {
        return wrapAsPromise(userData.getUserDisplayInfo, data)
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
      if (resourcePath === '/activeMailThreads') {
        return wrapAsPromise(mails.getActiveThreads, data)
      }
      if (resourcePath === '/unreadMailThreads') {
        return wrapAsPromise(mails.getUnreadThreads, data)
      }
      if (resourcePath === '/mails') {
        return wrapAsPromise(mails.getMailThread, data)
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
      if (resourcePath === '/posts') {
        return wrapAsPromise(posts.post, data)
      }
      const matchToUsersPath = resourcePath.match(USER_PATH_REG_EXP)
      if (matchToUsersPath != null) {
        return wrapAsPromise(userFavourites.post, {userId: matchToUsersPath[1], ...data})
      }
      if (resourcePath === '/mails') {
        return wrapAsPromise(mails.post, data)
      }
      if (resourcePath === '/mailReads') {
        return wrapAsPromise(mails.postMarkAsRead, data)
      }
      throw new Error(`Unknown route: POST ${resourcePath}`)
    },
    put (resourcePath, data) {
      if (resourcePath.startsWith('/posts/')) {
        const postId = resourcePath.substring('/posts/'.length)
        return wrapAsPromise(posts.put, {postId: postId, ...data})
      }
      throw new Error(`Unknown route: POST ${resourcePath}`)
    },
    delete (resourcePath, data) {
      if (resourcePath.startsWith('/posts/')) {
        const postId = resourcePath.substring('/posts/'.length)
        return wrapAsPromise(posts.delete, {postId: postId, ...data})
      }
      throw new Error(`Unknown route: POST ${resourcePath}`)
    }
  }
}

function makeServer () {
  const auther = new UserAuthServer()
  const postsServer = new PostsServer(auther)
  runAll(postsServer.postWithoutAuth, INITIAL_POSTS.map(post => { return { data: post } }))
  return new Server(
    auther,
    new UserDataServer(auther, INITIAL_USER_DATA),
    postsServer,
    new UserFavouritesServer(auther),
    new MailsServer(auther, postsServer))
}

export const mockServer = makeServer()
