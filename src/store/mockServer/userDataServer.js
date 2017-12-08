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