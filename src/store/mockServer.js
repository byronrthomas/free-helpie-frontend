function makeReversibleMap () {
  let map = {}
  let backMap = {}

  return {
    put (key, value) {
      map[key] = value
      backMap[value] = key
    },
    getByKey (key) {
      return map[key]
    },
    getByValue (value) {
      return backMap[value]
    }
  }
}

function UserAuthServer () {
  let usersToPassword = { 'test@test.com': 'secret' }
  let usersToAuth = makeReversibleMap()
  let unverifiedUsers = {}

  return {
    get (reqData, resolve, reject) {
      if (typeof (usersToPassword[reqData.username]) === 'string') {
        if (usersToPassword[reqData.username] === reqData.password) {
          if (!unverifiedUsers[reqData.username]) {
            usersToAuth.put(reqData.username, Math.random().toString())
            resolve({authData: usersToAuth.getByKey(reqData.username)})
          } else {
            reject('You need to verify your email address, please check your email for the verification email.')
          }
        } else {
          reject('Password not recognised')
        }
      } else {
        reject('Username not recognised')
      }
    },
    postUser (reqData, resolve, reject) {
      if (typeof reqData.username !== 'string' || typeof reqData.password !== 'string') {
        reject('Should provide a username and password')
      } else if (typeof (usersToPassword[reqData.username]) === 'string') {
        reject('This email address has already been registered')
      } else {
        usersToPassword[reqData.username] = reqData.password
        unverifiedUsers[reqData.username] = true
        resolve()
      }
    },
    postVerification (reqData, resolve, reject) {
      if (unverifiedUsers[reqData.username]) {
        delete unverifiedUsers[reqData.username]
        resolve()
      } else {
        reject('Not awaiting verification for this username')
      }
    }
  }
}

const MOCK_NETWORK_LATENCY = 500
function wrapAsPromise (func, data) {
  return new Promise(
    (resolve, reject) => {
      setTimeout(
        () => func(data, resolve, reject),
        MOCK_NETWORK_LATENCY)
    })
}

function Server (userAuth) {
  return {
    get (resourcePath, data) {
      if (resourcePath === '/users') {
        return wrapAsPromise(userAuth.get, data)
      }
      throw new Error(`Unknown route: GET ${resourcePath}`)
    },
    post (resourcePath, data) {
      if (resourcePath === '/users') {
        return wrapAsPromise(userAuth.postUser, data)
      }
      if (resourcePath === '/userVerification') {
        return wrapAsPromise(userAuth.postVerification, data)
      }
      throw new Error(`Unknown route: POST ${resourcePath}`)
    }
  }
}

export const mockServer = new Server(new UserAuthServer())
