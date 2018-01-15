import { UserAuthServer } from './mockServer/userAuthServer'
import { UserDataServer } from './mockServer/userDataServer'
import { PostsServer } from './mockServer/postsServer'
import { UserFavouritesServer } from './mockServer/userFavouritesServer'
import { MailsServer } from './mockServer/mailsServer'
import { INITIAL_POSTS } from './mockServer/initialPosts'
import { INITIAL_USER_DATA } from './mockServer/initialUserData'
import { INITIAL_MAILS, INITIAL_READ_MAILS } from './mockServer/initialMails'
import { runAll } from './mockServer/callbackTools'
import { UserAccountServer } from './mockServer/userAccountServer'
import { INITIAL_ACCOUNT_DETAILS } from './mockServer/initialAccountDetails'
import { ConnectedUserServer } from './mockServer/connectedUserServer'
import { INITIAL_CONNECTION_INVITES } from './mockServer/initialConnectionInvites'

const MOCK_NETWORK_LATENCY = 500
function wrapAsPromise (func, data) {
  return new Promise(
    (resolve, reject) => {
      setTimeout(
        () => func(data, resolve, reject),
        MOCK_NETWORK_LATENCY)
    })
}

const FAVOURITES_PATH_REG_EXP = RegExp(/^\/users\/(\d+)\/favourites$/)
const CONTACT_DETAILS_PATH_REG_EXP = RegExp(/^\/users\/(\d+)\/contactDetails$/)
const PROFILE_PATH_REG_EXP = RegExp(/^\/users\/(\d+)\/profile$/)
const FROM_CONNECTIONS_PATH_REG_EXP = RegExp(/^\/users\/(\d+)\/connectionInvitesFromMe$/)
const TO_CONNECTIONS_PATH_REG_EXP = RegExp(/^\/users\/(\d+)\/connectionInvitesToMe$/)
const EDIT_CONNECTION_PATH_REG_EXP = RegExp(/^\/users\/(\d+)\/connectionInvitesFromMe\/(\d+)$/)
function Server (config) {
  const userAuth = config.authServer
  const userData = config.profileServer
  const posts = config.postsServer
  const userFavourites = config.postFavouritesServer
  const mails = config.mailsServer
  const accountDetails = config.accountDeatilsServer
  const connections = config.connectionRequestsServer

  return {
    get (resourcePath, data) {
      if (resourcePath === '/accounts') {
        return wrapAsPromise(userAuth.get, data)
      }
      const matchToProfilePath = resourcePath.match(PROFILE_PATH_REG_EXP)
      if (matchToProfilePath != null) {
        return wrapAsPromise(userData.get, {userId: parseInt(matchToProfilePath[1]), ...data})
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
      const matchToFavouritesPath = resourcePath.match(FAVOURITES_PATH_REG_EXP)
      if (matchToFavouritesPath != null) {
        return wrapAsPromise(userFavourites.get, {userId: matchToFavouritesPath[1], ...data})
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
      const matchToContactDetailsPath = resourcePath.match(CONTACT_DETAILS_PATH_REG_EXP)
      if (matchToContactDetailsPath != null) {
        const userId = parseInt(matchToContactDetailsPath[1])
        return wrapAsPromise(accountDetails.get, {userId: userId, ...data})
      }
      const matchToConnectionsToPath = resourcePath.match(TO_CONNECTIONS_PATH_REG_EXP)
      if (matchToConnectionsToPath != null) {
        const userId = parseInt(matchToConnectionsToPath[1])
        return wrapAsPromise(connections.getConnectionsTo, {userId, ...data})
      }
      const matchToConnectionsFromPath = resourcePath.match(FROM_CONNECTIONS_PATH_REG_EXP)
      if (matchToConnectionsFromPath != null) {
        const userId = parseInt(matchToConnectionsFromPath[1])
        return wrapAsPromise(connections.getConnectionsFrom, {userId, ...data})
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
      const matchToProfilePath = resourcePath.match(PROFILE_PATH_REG_EXP)
      if (matchToProfilePath != null) {
        return wrapAsPromise(userData.post, {userId: parseInt(matchToProfilePath[1]), ...data})
      }
      if (resourcePath === '/posts') {
        return wrapAsPromise(posts.post, data)
      }
      const matchToUsersPath = resourcePath.match(FAVOURITES_PATH_REG_EXP)
      if (matchToUsersPath != null) {
        return wrapAsPromise(userFavourites.post, {userId: matchToUsersPath[1], ...data})
      }
      if (resourcePath === '/mails') {
        return wrapAsPromise(mails.post, data)
      }
      if (resourcePath === '/mailReads') {
        return wrapAsPromise(mails.postMarkAsRead, data)
      }
      const matchToContactDetailsPath = resourcePath.match(CONTACT_DETAILS_PATH_REG_EXP)
      if (matchToContactDetailsPath != null) {
        const userId = parseInt(matchToContactDetailsPath[1])
        return wrapAsPromise(accountDetails.post, {userId: userId, ...data})
      }
      const matchToConnectionsFromPath = resourcePath.match(FROM_CONNECTIONS_PATH_REG_EXP)
      if (matchToConnectionsFromPath != null) {
        const userId = parseInt(matchToConnectionsFromPath[1])
        return wrapAsPromise(connections.postConnectionRequest, {userId, ...data})
      }
      throw new Error(`Unknown route: POST ${resourcePath}`)
    },
    put (resourcePath, data) {
      if (resourcePath.startsWith('/posts/')) {
        const postId = resourcePath.substring('/posts/'.length)
        return wrapAsPromise(posts.put, {postId: postId, ...data})
      }
      const matchToContactDetailsPath = resourcePath.match(CONTACT_DETAILS_PATH_REG_EXP)
      if (matchToContactDetailsPath != null) {
        const userId = parseInt(matchToContactDetailsPath[1])
        return wrapAsPromise(accountDetails.put, {userId: userId, ...data})
      }
      throw new Error(`Unknown route: POST ${resourcePath}`)
    },
    delete (resourcePath, data) {
      if (resourcePath.startsWith('/posts/')) {
        const postId = resourcePath.substring('/posts/'.length)
        return wrapAsPromise(posts.delete, {postId: postId, ...data})
      }
      const matchToConnectionsEditPath = resourcePath.match(EDIT_CONNECTION_PATH_REG_EXP)
      if (matchToConnectionsEditPath != null) {
        const userId = parseInt(matchToConnectionsEditPath[1])
        const otherUserId = parseInt(matchToConnectionsEditPath[2])
        const reqData = {...data, userId, data: {invitedUserId: otherUserId}}
        return wrapAsPromise(connections.deleteConnectionRequest, reqData)
      }
      throw new Error(`Unknown route: POST ${resourcePath}`)
    }
  }
}

function handlePost (postsServer) {
  return (post, resolve, reject) => {
    const posterId = post.postedBy
    const data = {...post}
    delete post.postedBy
    postsServer.postWithoutAuth(posterId, {data}, resolve, reject)
  }
}

export function makeServer () {
  const auther = new UserAuthServer()
  const postsServer = new PostsServer(auther)
  runAll(handlePost(postsServer), INITIAL_POSTS)
  const mailsServer = new MailsServer(auther, postsServer)
  INITIAL_MAILS.forEach(mail => mailsServer.directPost(mail.threadId, mail.mailData, mail.postAuthor))
  runAll(mailsServer.syncPostMarkAsRead, INITIAL_READ_MAILS)
  const accountDeatilsServer = new UserAccountServer(auther, INITIAL_ACCOUNT_DETAILS)

  const config = {
    authServer: auther,
    profileServer: new UserDataServer(auther, INITIAL_USER_DATA),
    postsServer,
    postFavouritesServer: new UserFavouritesServer(auther),
    mailsServer,
    accountDeatilsServer,
    connectionRequestsServer: new ConnectedUserServer(auther, INITIAL_CONNECTION_INVITES)
  }
  return new Server(config)
}

export const mockServer = makeServer()
