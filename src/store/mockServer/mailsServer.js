function compareDates (aDate, bDate) {
  return aDate.getTime() - bDate.getTime()
}

export function MailsServer (userAuth, postsServer) {
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

  const recordThreadActivity = (threadId, username, newUnreadMails) => {
    const threadKey = makeThreadKey(threadId)
    if (!activeThreads[username]) {
      activeThreads[username] = {}
    }
    if (!activeThreads[username][threadKey]) {
      activeThreads[username][threadKey] = {unreadMails: []}
    }
    activeThreads[username][threadKey] = {
      id: threadId,
      unreadMails: [
        ...newUnreadMails,
        ...activeThreads[username][threadKey].unreadMails]
    }
  }

  const getActiveThreads = (username) => {
    if (!activeThreads[username]) {
      return []
    }
    const result = []
    for (const threadKey in activeThreads[username]) {
      if (activeThreads[username].hasOwnProperty(threadKey)) {
        result.push(activeThreads[username][threadKey].id)
      }
    }
    return result
  }

  const getUnreadThreads = (username) => {
    if (!activeThreads[username]) {
      return []
    }
    const result = []
    for (const threadKey in activeThreads[username]) {
      if (activeThreads[username].hasOwnProperty(threadKey) &&
        activeThreads[username][threadKey].unreadMails.length > 0) {
        result.push(activeThreads[username][threadKey].id)
      }
    }
    return result
  }

  const srv = {
    postWithoutAuth (authedUserId, reqData, resolve, reject) {
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
      const postAuthorId = postsServer.syncGetPostedBy(data.relatedToPostId)
      if (typeof postAuthorId !== 'number') {
        reject(new Error(`Cannot post a mail related to - ${data.relatedToPostId} - can't find this post`))
        return
      }
      const threadAuthor = data.threadAuthor
      // console.log('username = ', username)
      // console.log('postAuthor = ', postAuthor)
      // console.log('threadAuthor = ', threadAuthor)
      if (authedUserId !== postAuthorId && authedUserId !== threadAuthor) {
        reject(new Error('Cannot post a mail - you must be either the postAuthor or threadAuthor'))
        return
      }

      if (postAuthorId === threadAuthor) {
        reject(new Error('Cannot start a thread about a post you wrote yourself - who would you email?'))
        return
      }

      const newMail = {sender: authedUserId, sent: new Date(), text: data.mailText, id: nextMailId++}
      const threadId = {relatedToPostId: data.relatedToPostId, threadAuthor: threadAuthor}
      persistMail(makeThreadKey(threadId), newMail)
      if (authedUserId === postAuthorId) {
        recordThreadActivity(threadId, threadAuthor, [newMail.id])
        recordThreadActivity(threadId, postAuthorId, [])
      } else {
        recordThreadActivity(threadId, threadAuthor, [])
        recordThreadActivity(threadId, postAuthorId, [newMail.id])
      }

      // console.log('activeThreads', activeThreads)
      console.log('Posting mail succeeded')
      resolve()
    },
    post (reqData, resolve, reject) {
      if (!reqData.authToken || !userAuth.syncGetUserCanPostMails(reqData.authToken)) {
        reject(new Error('Error: you must be authenticated to view posts'))
        return
      }
      const userIds = userAuth.syncGetAuthUsers(reqData.authToken)
      console.log('Post email req: ', reqData)
      // console.log(reqData)
      if (userIds.length !== 1) {
        reject(new Error('Error: can\'t work out your UserID from your auth token'))
        return
      }
      srv.postWithoutAuth(userIds[0], reqData, resolve, reject)
    },
    getMailThread (reqData, resolve, reject) {
      // TODO: should reject requests that aren't from the thread author or poster
      if (!reqData.authToken || !userAuth.syncGetUserCanReadMails(reqData.authToken, reqData.threadAuthor, reqData.relatedToPostId)) {
        reject(new Error('Error: you must be authenticated to view mail threads'))
      }
      if (!reqData.hasOwnProperty('data')) {
        reject(new Error('Error: you must supply data'))
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
      if (data.sortField === 'sent') {
        if (data.sortOrderAsc) {
          respData.sort((mail1, mail2) => compareDates(mail1.sent, mail2.sent))
        } else {
          respData.sort((mail1, mail2) => compareDates(mail2.sent, mail1.sent))
        }
      }
      resolve({data: respData})
    },
    getActiveThreads (reqData, resolve, reject) {
      if (!reqData.authToken) {
        reject(new Error('Error: you must be authenticated to view posts'))
        return
      }
      const userIds = userAuth.syncGetAuthUsers(reqData.authToken)
      if (userIds.length !== 1) {
        reject(new Error('Error: can\'t work out your UserID from your auth token'))
        return
      }
      const userId = userIds[0]
      const respData = getActiveThreads(userId)
      // console.log('username to look up', username)

      resolve({data: respData})
    },
    getUnreadThreads (reqData, resolve, reject) {
      if (!reqData.authToken) {
        reject(new Error('Error: you must be authenticated to view posts'))
        return
      }
      const userIds = userAuth.syncGetAuthUsers(reqData.authToken)
      if (userIds.length !== 1) {
        reject(new Error('Error: can\'t work out your UserID from your auth token'))
        return
      }
      const userId = userIds[0]
      const respData = getUnreadThreads(userId)
      // console.log('username to look up', username)

      resolve({data: respData})
    },
    postMarkAsRead (reqData, resolve, reject) {
      if (!reqData.authToken || !userAuth.syncGetUserCanPostMails(reqData.authToken)) {
        reject(new Error('Error: you must be authenticated to mark mails as read'))
        return
      }
      const userIds = userAuth.syncGetAuthUsers(reqData.authToken)
      if (userIds.length !== 1) {
        reject(new Error('Error: can\'t work out your UserID from your auth token'))
        return
      }
      const userId = userIds[0]
      if (!reqData.hasOwnProperty('data')) {
        reject(new Error('Cannot mark as read - empty data'))
        return
      }
      const data = reqData.data
      if (!data.hasOwnProperty('relatedToPostId') ||
        !data.hasOwnProperty('threadAuthor') ||
        !data.hasOwnProperty('readMailId')) {
        reject(new Error('Cannot mark mail as read - data must contain relatedToPostId and threadAuthor and readMailId'))
        return
      }
      const threadKey = makeThreadKey({threadAuthor: data.threadAuthor, relatedToPostId: data.relatedToPostId})

      const activityForThread = activeThreads[userId][threadKey]
      const idToMark = data.readMailId
      if (activityForThread && activityForThread.unreadMails.includes(idToMark)) {
        activityForThread.unreadMails = activityForThread.unreadMails.filter(x => x !== idToMark)
        resolve()
      } else {
        if (!activityForThread) {
          reject(new Error('Cannot mark as read - thread not found'))
        } else {
          reject(new Error(`Cannot mark as read - unread mails does not contain ID ${idToMark} only has ` + activityForThread.unreadMails.join()))
        }
      }
    }
  }
  return srv
}
