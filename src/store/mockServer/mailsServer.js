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

  const recordThreadActivity = (threadInfo, username, newUnreadMails) => {
    const threadKey = makeThreadKey(threadInfo.threadId)
    if (!activeThreads[username]) {
      activeThreads[username] = {}
    }
    if (!activeThreads[username][threadKey]) {
      activeThreads[username][threadKey] = {unreadMails: []}
    }
    activeThreads[username][threadKey] = {
      info: threadInfo,
      unreadMails: [
        ...newUnreadMails,
        ...activeThreads[username][threadKey].unreadMails]
    }
  }

  const makeActivityRecord = activeThreadRecord => {
    return {
      ...activeThreadRecord.info,
      unread: activeThreadRecord.unreadMails.length > 0
    }
  }
  const getActiveThreads = (username) => {
    if (!activeThreads[username]) {
      return []
    }
    const result = []
    for (const threadKey in activeThreads[username]) {
      if (activeThreads[username].hasOwnProperty(threadKey)) {
        result.push(makeActivityRecord(activeThreads[username][threadKey]))
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
        result.push(activeThreads[username][threadKey].info.threadId)
      }
    }
    return result
  }

  const srv = {
    directPost (threadId, mailData, postAuthorId) {
      const senderId = mailData.sender
      const newMail = {...mailData, id: nextMailId++}
      const threadInfo = {
        threadId: threadId,
        postAuthor: postAuthorId,
        latestMessageSent: newMail.sent
      }
      const threadAuthor = threadId.threadAuthor
      persistMail(makeThreadKey(threadId), newMail)
      if (senderId === postAuthorId) {
        recordThreadActivity(threadInfo, threadAuthor, [newMail.id])
        recordThreadActivity(threadInfo, postAuthorId, [])
      } else {
        recordThreadActivity(threadInfo, threadAuthor, [])
        recordThreadActivity(threadInfo, postAuthorId, [newMail.id])
      }
    },
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
      const threadId = {relatedToPostId: data.relatedToPostId, threadAuthor: threadAuthor}
      const newMail = {sender: authedUserId, sent: new Date(), text: data.mailText}
      srv.directPost(threadId, newMail, postAuthorId)

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
      // console.log('Post email req: ', reqData)
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
    syncPostMarkAsRead (req, resolve, reject) {
      const data = req.data
      const userId = req.userId
      if (!data.hasOwnProperty('relatedToPostId') ||
        !data.hasOwnProperty('threadAuthor') ||
        !data.hasOwnProperty('timestampReadUpTo')) {
        reject(new Error('Cannot mark mail as read - data must contain relatedToPostId and threadAuthor and timestampReadUpTo'))
        return
      }
      const threadKey = makeThreadKey({threadAuthor: data.threadAuthor, relatedToPostId: data.relatedToPostId})

      const activityForThread = activeThreads[userId][threadKey]
      const timestampToMark = data.timestampReadUpTo
      if (activityForThread && (timestampToMark === activityForThread.info.latestMessageSent)) {
        activityForThread.unreadMails = []
        resolve()
      } else {
        if (!activityForThread) {
          reject(new Error('Cannot mark as read - thread not found'))
        } else {
          reject(new Error(`Cannot mark as read - latest message sent is ${activityForThread.info.latestMessageSent} but submitted latest read timestamp was ${timestampToMark}`))
        }
      }
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
      srv.syncPostMarkAsRead({userId, data}, resolve, reject)
    }
  }
  return srv
}
