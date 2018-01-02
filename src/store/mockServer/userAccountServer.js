export function UserAccountServer (userAuth, initialAccountData) {
  const userData = initialAccountData || {}

  return {
    get (reqData, resolve, reject) {
      console.log('GET useraccount: ', reqData)
      if (!reqData.hasOwnProperty('userId')) {
        reject(new Error('Cannot get user account details without a userId'))
        return
      }
      if (!userAuth.syncGetIsAllowedToSeeAccountDetails(reqData.authToken, reqData.userId)) {
        console.log('Not authorised to get details for userID, returning null, userId: ', reqData.userId)
        resolve({data: null})
        return
      }
      if (!userData[reqData.userId]) {
        console.log('GET useraccount: No account data found for this userId, returning null')
        resolve({data: null})
        return
      }
      console.log('GET useraccount: successful get returning data')
      const toReturn = {...userData[reqData.userId]}
      resolve({data: toReturn})
    },
    post (reqData, resolve, reject) {
      console.log('POST useraccount: req =', reqData)
      if (!reqData.hasOwnProperty('userId')) {
        reject(new Error('Cannot post user account details without a userId'))
        return
      }
      if (!userAuth.syncCanPostAccountDetails(reqData.authToken, reqData.userId)) {
        reject(new Error('Cannot post user account details - not authorised'))
        return
      }
      if (!reqData.hasOwnProperty('data')) {
        reject(new Error('Cannot post user account details without data to post'))
        return
      }
      const userId = reqData.userId

      console.log('POST useraccount: Saving user account details for userID ' + userId)
      userData[userId] = reqData.data
      resolve()
    },
    put (reqData, resolve, reject) {
      console.log('PUT useraccount: req =', reqData)
      if (!reqData.hasOwnProperty('userId')) {
        reject(new Error('Cannot put user account details without a userId'))
        return
      }
      if (!userAuth.syncCanPostAccountDetails(reqData.authToken, reqData.userId)) {
        reject(new Error('Cannot put user account details - not authorised'))
        return
      }
      if (!reqData.hasOwnProperty('data')) {
        reject(new Error('Cannot put user account details without data to put'))
        return
      }
      const userId = reqData.userId
      if (!userData[userId]) {
        console.log('PUT useraccount: No existing account data found for this userId, cannot put, userId: ', userId)
        reject(new Error('Cannot put user account details unless the account details already exist'))
        return
      }
      console.log('PUT useraccount: Updating user account details for userID ' + userId)
      userData[userId] = reqData.data
      resolve()
    }
  }
}
