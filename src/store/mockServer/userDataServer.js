export function UserDataServer (userAuth, initialUserData) {
  const userData = initialUserData || {}

  return {
    get (reqData, resolve, reject) {
      console.log('GET userdata: req = ', reqData)
      if (!reqData.hasOwnProperty('userId')) {
        reject(new Error('Cannot get user profile without a userId'))
        return
      }
      if (!userAuth.syncGetIsAllowedToSeeProfile(reqData.authToken, reqData.userId)) {
        console.log('Not authorised to get details for userID, returning null, userId: ', reqData.userId)
        resolve({data: null})
        return
      }
      const userId = reqData.userId
      if (userData.hasOwnProperty(userId)) {
        const dataToReturn = userData[userId]
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
      console.log('POST userdata: req = ', reqData)
      if (!reqData.hasOwnProperty('userId')) {
        reject(new Error('Cannot post user profile without a userId'))
        return
      }
      const userId = reqData.userId
      if (!userAuth.syncCanPostUserProfile(reqData.authToken, userId)) {
        reject(new Error('Not authorised to post details for userId - ' + userId))
        return
      }

      console.log('POST userdata: Saving user data for userID ' + userId)
      userData[userId] = reqData.data
      resolve()
    }
  }
}
