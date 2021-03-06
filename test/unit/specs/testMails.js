const user1 = {id: 1, username: 'User1', authToken: Math.random()}
const user2 = {id: 2, username: 'User2', authToken: Math.random()}
const user3 = {id: 3, username: 'User3', authToken: Math.random()}

export const TEST_MAIL_USERS = [user1, user2, user3]

const postByUser1 = {
  postId: 101,
  postedBy: user1
}
const postByUser2 = {
  postId: 102,
  postedBy: user2
}

export const TEST_POSTS = [postByUser1, postByUser2]

/// Want a setup where a poster (user1) has multiple threads for one post (postByUser1),
/// and some user has started multiple threads about other posts (user3)
export const TEST_MAILS = [
  {threadName: '1',
    postAuthor: user1,
    threadAuthor: user2,
    userWithUnread: user2,
    threadId: {relatedToPostId: postByUser1.postId, threadAuthor: user2.id},
    mails: [{
      sender: user2,
      text: 'I could help you'},
    {sender: user1,
      text: 'Oh yeah, where you living?'}]
  },
  {threadName: '2',
    postAuthor: user2,
    threadAuthor: user3,
    userWithUnread: user2,
    threadId: {relatedToPostId: postByUser2.postId, threadAuthor: user3.id},
    mails: [{
      sender: user3,
      text: 'Hey, I\'ve been coaching for ten years, let\'s meet for a coffee'},
    {sender: user2,
      text: 'Maybe - how many hours a week do you have spare?'},
    {sender: user3,
      text: '10 hrs, I don\'t work much'}]
  },
  {threadName: '3',
    postAuthor: user1,
    threadAuthor: user3,
    userWithUnread: user1,
    threadId: {relatedToPostId: postByUser1.postId, threadAuthor: user3.id},
    mails: [{
      sender: user3,
      text: 'Hey - do you need help with coaching at all?'}]
  }
]
