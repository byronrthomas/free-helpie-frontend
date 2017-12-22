export function MailsServer(userAuth, postsServer) {
  const mails = {}
  let nextMailId = 0

  const srv = {
    postWithoutAuth (postUser, reqData, resolve, reject) {
      if (!reqData.hasOwnProperty('data')) {
        reject(new Error('Cannot post a mail - empty data'))
        return
      }
      const data = reqData.data
      if (!data.hasOwnProperty('relatedToPostId') || 
        !data.hasOwnProperty('threadAuthor') ||
        !data.hasOwnProperty('mailText')) {
        reject(new Error('Cannot post a mail - data must contain relatedToPostId and threadAuthor and mailText'))
        return
      }
      const postAuthor = postsServer.syncGetPostedBy(data.relatedToPostId)
      console.log('postUser = ', postUser)
      console.log('postAuthor = ', postAuthor)
      
      const postUserName = postUser.username
      if (postUserName !== postAuthor && postUserName !== data.threadAuthor) {
        reject(new Error('Cannot post a mail - you must be either the postAuthor or threadAuthor'))
        return
      }

      let newMail = {sender: postUser.username, sent: new Date(), text: data.mailText, id: nextMailId++}
      let threadKey = `${data.relatedToPostId}:${data.threadAuthor}`
      if (!mails.hasOwnProperty(threadKey)) {
        mails[threadKey] = []
      }
      mails[threadKey].push(newMail)
      console.log('Posting mail succeeded')
      resolve()
    },
    post (reqData, resolve, reject) {
      if (!reqData.authToken || !userAuth.syncGetUserCanPostMails(reqData.authToken)) {
        reject(new Error('Error: you must be authenticated to view posts'))
        return
      }
      const users = userAuth.syncGetAuthUsers(reqData.authToken)
      console.log(reqData)
      if (users.length !== 1) {
        reject(new Error('Error: can\'t work out your UserID from your auth token'))
        return
      }
      srv.postWithoutAuth(users[0], reqData, resolve, reject)
    },
    getMailThread (reqData, resolve, reject) {
      // TODO: should reject requests that aren't from the thread author or poster
      if (!reqData.authToken || !userAuth.syncGetUserCanReadMails(reqData.authToken, reqData.threadAuthor, reqData.relatedToPostId)) {
        reject(new Error('Error: you must be authenticated to view mail threads'))
      }
      if (!reqData.hasOwnProperty('data')) {
        reject(new Error("Error: you must supply data"))
      }
      const data = reqData.data
      if (!data.hasOwnProperty('relatedToPostId') || 
        !data.hasOwnProperty('threadAuthor')) {
        reject(new Error('Cannot get a mail thread - data must contain relatedToPostId and threadAuthor'))
        return
      }
      let threadKey = `${data.relatedToPostId}:${data.threadAuthor}`
      const respData = mails.hasOwnProperty(threadKey) 
        ? [...mails[threadKey]]
        : []
      resolve({data: respData})
    }
  }
  return srv

}