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
  let authToUsers = {}

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
    },
    syncGetAuthUsers(token) {
      if (authToUsers[token]) {
        // TODO: add a check that this is a valid token!
        return authToUsers[token]
      } else {
        return []
      }
    },
    syncPutAuthUsers(token, value) {
      authToUsers[token] = value
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

function UserDataServer(userAuth) {
  const userData = {}
  let nextId = 0
  return {
    get (reqData, resolve, reject) {
      console.log("GET userdata: Getting users authorised by token " + reqData)
      const users = userAuth.syncGetAuthUsers(reqData)
      if (users.length == 0) {
        console.log("GET userdata: No users authorised by this token, returning empty")
        resolve({data: {}})
        return;
      }
      const userIdForAuth = users[0]
      console.log("GET userdata: User found as " + userIdForAuth)
      if (userData.hasOwnProperty(userIdForAuth)) {
        let dataToReturn = {}
        dataToReturn[userIdForAuth] = userData[userIdForAuth]
        resolve({data: dataToReturn})
        console.log("GET userdata: Data present for user - returning single user data")
      } else {
        resolve({data: {}})
        console.log("GET userdata: No data present for user - returning empty")
      }
    },
    put(reqData, resolve, reject) {
      const users = userAuth.syncGetAuthUsers(reqData.token)
      console.log("PUT userdata: Getting users authorised by token " + reqData.token)
      let userId;
      if (users.length == 0) {
        userId = nextId++
        userAuth.syncPutAuthUsers(reqData.token, [userId])
        console.log("PUT userdata: Generating new userID for token " + userId)
      } else {
        userId = users[0]
      }

      console.log("PUT userdata: Saving user data for userID " + userId)
      userData[userId] = reqData.data
      resolve();
    }
  }
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
