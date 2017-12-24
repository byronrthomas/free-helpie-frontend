export function MailsServer(userAuth, postsServer) {
  const mails = {}
  const activeThreads = {}
  let nextMailId = 0

  const persistMail = (threadKey, content) => {
    if (!mails.hasOwnProperty(threadKey)) {
      mails[threadKey] = []
    }
    mails[threadKey].push(content)
  }

  const makeThreadKey = (threadId) => {
    return `${threadId.relatedToPostId}:${threadId.threadAuthor}`
  }

  const recordThreadActivity = (threadId, username) => {
    if (!activeThreads.hasOwnProperty(username)) {
      activeThreads[username] = {}
    }
    activeThreads[username][makeThreadKey(threadId)] = threadId
  }

  const getActiveThreads = (username) => {
    if (!activeThreads[username]) {
      return []
    }
    const result = []
    for (const threadKey in activeThreads[username]) {
      if (activeThreads[username].hasOwnProperty(threadKey)) {
        result.push(activeThreads[username][threadKey]);
      }
    }
    return result
  }

  const srv = {
    postWithoutAuth (authedUser, reqData, resolve, reject) {
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
      // console.log('postUser = ', authedUser)
      // console.log('postAuthor = ', postAuthor)
      
      const username     = authedUser.username
      const threadAuthor = data.threadAuthor
      if (username !== postAuthor && username !== threadAuthor) {
        reject(new Error('Cannot post a mail - you must be either the postAuthor or threadAuthor'))
        return
      }

      if (postAuthor === threadAuthor) {
        reject(new Error('Cannot start a thread about a post you wrote yourself - who would you email?'))
        return
      }

      const newMail = {sender: username, sent: new Date(), text: data.mailText, id: nextMailId++}
      const threadId = {relatedToPostId: data.relatedToPostId, threadAuthor: threadAuthor}
      persistMail(makeThreadKey(threadId), newMail)
      // const userToAlert = postAuthor === postUserName ? data.threadAuthor : postAuthor
      recordThreadActivity(threadId, threadAuthor)
      recordThreadActivity(threadId, postAuthor)

      // console.log('activeThreads', activeThreads)
      console.log('Posting mail succeeded')
      resolve()
    },
    post (reqData, resolve, reject) {
      if (!reqData.authToken || !userAuth.syncGetUserCanPostMails(reqData.authToken)) {
        reject(new Error('Error: you must be authenticated to view posts'))
        return
      }
      const users = userAuth.syncGetAuthUsers(reqData.authToken)
      // console.log(reqData)
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
      let threadKey = makeThreadKey(reqData.data)
      const respData = mails.hasOwnProperty(threadKey) 
        ? [...mails[threadKey]]
        : []
      resolve({data: respData})
    },
    getActiveThreads (reqData, resolve, reject) {
      if (!reqData.authToken) {
        reject(new Error('Error: you must be authenticated to view posts'))
        return
      }
      const users = userAuth.syncGetAuthUsers(reqData.authToken)
      if (users.length !== 1) {
        reject(new Error('Error: can\'t work out your UserID from your auth token'))
        return
      }
      const username = users[0].username
      const respData = getActiveThreads(username)
      // console.log('username to look up', username)
      
      resolve({data: respData})
    }
  }
  return srv

}