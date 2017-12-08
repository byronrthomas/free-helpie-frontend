import { UserAuthServer } from './mockServer/userAuthServer'
import { UserDataServer } from './mockServer/userDataServer'

const MOCK_NETWORK_LATENCY = 500
function wrapAsPromise (func, data) {
  return new Promise(
    (resolve, reject) => {
      setTimeout(
        () => func(data, resolve, reject),
        MOCK_NETWORK_LATENCY)
    })
}

function Server (userAuth, userData) {
  return {
    get (resourcePath, data) {
      if (resourcePath === '/accounts') {
        return wrapAsPromise(userAuth.get, data)
      } 
      if (resourcePath.startsWith('/users?token=')) {
        return wrapAsPromise(userData.get, resourcePath.substring('/users?token='.length))
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
          userData.put, 
          {token: resourcePath.substring('/users?token='.length), data: data})
      }
      throw new Error(`Unknown route: POST ${resourcePath}`)
    }
  }
}

const auther = new UserAuthServer()
export const mockServer = new Server(auther, new UserDataServer(auther))
