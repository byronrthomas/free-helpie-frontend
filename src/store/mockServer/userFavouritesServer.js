export function UserFavouritesServer (userAuth) {
  const userData = {}
  return {
    get (reqData, resolve, reject) {
      const userId = reqData.userId
      console.log('GET userfavourites with req =')
      console.log(reqData)
      const users = userAuth.syncGetAuthUsers(reqData.authToken)
      if (users.length === 0 || !users.includes(parseInt(userId))) {
        console.log('GET userfavourites: Users authorised by this token don\'t include current user, returning empty')
        resolve({data: []})
        return
      }
      if (userData.hasOwnProperty(userId)) {
        resolve({data: userData[userId]})
        console.log('GET userfavourites: Data present for user - returning favourites')
      } else {
        resolve({data: []})
        console.log('GET userfavourites: No data present for user - returning empty')
      }
    },
    post (reqData, resolve, reject) {
      const userId = reqData.userId
      console.log('PUT userfavourites with req =')
      console.log(reqData)
      const users = userAuth.syncGetAuthUsers(reqData.authToken)
      console.log('Users authorized = ')
      console.log(users)
      if (users.length === 0 || !users.includes(parseInt(userId))) {
        console.log('PUT userfavourites: Users authorised by this token don\'t include current user')
        reject(new Error('Forbidden: current user not authorised to edit favourites for user Id ' + userId))
        return
      }
      if (!reqData.hasOwnProperty('data') || !Array.isArray(reqData.data)) {
        console.log('PUT userfavourites: error - no reqData.data or req.Data.data not an array - should be an array')
        reject(new Error('Unable to store favourites, bad data on request'))
        return
      }
      userData[userId] = reqData.data
      console.log('PUT userfavourites: data updated')
      resolve()
    }
  }
}
