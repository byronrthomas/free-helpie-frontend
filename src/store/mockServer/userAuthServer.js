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

export function UserAuthServer () {
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
