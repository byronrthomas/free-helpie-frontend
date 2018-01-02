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
  let initialUserData = {
    'test@test.com': {password: 'secret', userId: 3},
    'jd@jd.com': {password: 'jd', userId: 0},
    'ws@ws.com': {password: 'ws', userId: 1},
    'js@js.com': {password: 'js', userId: 2}
  }
  const userData = {...initialUserData}
  let nextId = -1
  for (const username in userData) {
    if (userData.hasOwnProperty(username)) {
      nextId = Math.max(nextId, userData[username].userId)
    }
  }
  nextId = nextId + 1
  let usersToAuth = makeReversibleMap()
  let unverifiedUsers = {}

  return {
    get (reqData, resolve, reject) {
      if (userData[reqData.username]) {
        const userRecord = userData[reqData.username]
        if (userRecord.password === reqData.password) {
          if (!unverifiedUsers[reqData.username]) {
            usersToAuth.put(userRecord.userId, Math.random().toString())
            resolve({authData: usersToAuth.getByKey(userRecord.userId), userId: userRecord.userId})
          } else {
            reject(new Error('You need to verify your email address, please check your email for the verification email.'))
          }
        } else {
          reject(new Error('Password not recognised'))
        }
      } else {
        reject(new Error('Username not recognised'))
      }
    },
    postUser (reqData, resolve, reject) {
      if (typeof reqData.username !== 'string' || typeof reqData.password !== 'string') {
        reject(new Error('Should provide a username and password'))
      } else if (userData.hasOwnProperty(reqData.username)) {
        reject(new Error('This email address has already been registered'))
      } else {
        userData[reqData.username] = {password: reqData.password, userId: nextId++}
        unverifiedUsers[reqData.username] = true
        resolve()
      }
    },
    postVerification (reqData, resolve, reject) {
      if (unverifiedUsers[reqData.username]) {
        delete unverifiedUsers[reqData.username]
        resolve()
      } else {
        reject(new Error('Not awaiting verification for this username'))
      }
    },
    syncGetAuthUsers (token) {
      console.debug('Asking for token ' + token)
      console.debug('current auths = ')
      const users = usersToAuth.getByValue(token)
      console.debug(users)
      if (users) {
        console.debug('Found users for token = ')
        console.debug(users)
        return [users]
      } else {
        console.debug('No auth found for token')
        return []
      }
    },
    syncGetUserCanSeeFullPosts (token, value) {
      return typeof usersToAuth.getByValue(token) !== 'undefined'
    },
    syncGetUserCanPost (token) {
      return typeof usersToAuth.getByValue(token) !== 'undefined'
    },
    syncGetUserCanUpdate (token, postId) {
      return typeof usersToAuth.getByValue(token) !== 'undefined'
    },
    syncGetUserCanDelete (token, postId) {
      return typeof usersToAuth.getByValue(token) !== 'undefined'
    },
    syncGetUserCanPostMails (token) {
      return typeof usersToAuth.getByValue(token) !== 'undefined'
    },
    syncGetUserCanReadMails (token, postId, threadAuthor) {
      return typeof usersToAuth.getByValue(token) !== 'undefined'
    },
    syncGetUserCanSeeUserProfiles (token) {
      return typeof usersToAuth.getByValue(token) !== 'undefined'
    },
    syncCanPostAccountDetails (token, userId) {
      const loggedInUserId = usersToAuth.getByValue(token)
      // For now - are they loggedin and posting to their own userId?
      return (typeof userId !== 'undefined') && userId === loggedInUserId
    },
    syncCanPostUserProfile (token, userId) {
      const loggedInUserId = usersToAuth.getByValue(token)
      // For now - are they loggedin and posting to their own userId?
      return (typeof userId !== 'undefined') && userId === loggedInUserId
    },
    syncGetIsAllowedToSeeAccountDetails (token, userId) {
      const loggedInUserId = usersToAuth.getByValue(token)
      // console.log('loggedInUserId = ', loggedInUserId)
      return (typeof userId !== 'undefined') && userId === loggedInUserId
    },
    syncGetIsAllowedToSeeProfile (token, userId) {
      const loggedInUserId = usersToAuth.getByValue(token)
      // console.log('loggedInUserId = ', loggedInUserId)
      // console.log('userId = ', userId)
      // Basically just "did they supply a userId and is their token valid"
      return Boolean((typeof userId !== 'undefined') &&  (typeof loggedInUserId !== 'undefined'))
    }
  }
}
