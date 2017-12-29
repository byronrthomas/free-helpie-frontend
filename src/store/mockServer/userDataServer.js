export function UserDataServer (userAuth, initialUserData) {
  const userData = initialUserData || {}

  return {
    get (reqData, resolve, reject) {
      console.log('GET userdata: Getting users authorised by token ' + reqData)
      const users = userAuth.syncGetAuthUsers(reqData)
      if (users.length === 0) {
        console.log('GET userdata: No users authorised by this token, returning empty')
        resolve({data: {}})
        return
      }
      const userIdForAuth = users[0]
      console.log('GET userdata: User found as ' + userIdForAuth)
      if (userData.hasOwnProperty(userIdForAuth)) {
        let dataToReturn = {}
        dataToReturn[userIdForAuth] = userData[userIdForAuth]
        resolve({data: dataToReturn})
        console.log('GET userdata: Data present for user - returning single user data')
      } else {
        resolve({data: {}})
        console.log('GET userdata: No data present for user - returning empty')
      }
    },
    getUserDisplayInfo (reqData, resolve, reject) {
      console.log('GET user display info: ', reqData)
      if (!userAuth.syncGetUserCanSeeUserProfiles(reqData.authToken)) {
        reject(new Error('Cannot get user display info, current user not authorized to do so'))
        return
      }
      let dataToReturn = {}
      for (const userId of reqData.data.userIds) {
        if (userData.hasOwnProperty(userId)) {
          dataToReturn[userId] = userData[userId].personalInfo
        }
      }
      resolve({data: dataToReturn})
    },
    post (reqData, resolve, reject) {
      const users = userAuth.syncGetAuthUsers(reqData.token)
      console.log('PUT userdata: Getting users authorised by token ' + reqData.token)
      let userId
      if (users.length !== 1) {
        reject(new Error('Cannot find logged in user for this token'))
        return
      } else {
        userId = users[0]
      }

      console.log('PUT userdata: Saving user data for userID ' + userId)
      userData[userId] = reqData.data
      resolve()
    }
  }
}
