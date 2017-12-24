const user1 = {id: 1, username: 'User1', authToken: Math.random()}
const user2 = {id: 2, username: 'User2', authToken: Math.random()}
const user3 = {id: 3, username: 'User3', authToken: Math.random()}

export const INITIAL_MAIL_USERS = [user1, user2, user3]

const postByUser1 = {
  postId: 101,
  postedBy: user1
}
const postByUser2 = {
  postId: 102,
  postedBy: user2
}

export const INITIAL_POSTS = [postByUser1, postByUser2]

/// Want a setup where a poster (user1) has multiple threads for one post (postByUser1),
/// and some user has started multiple threads about other posts (user3)
export const INITIAL_MAILS = [
  {postId: postByUser1.postId,
  userWithUnread: user2,
  mails: [{
    sender: user2,
    text: 'I could help you'},
    {sender: user1,
    text: 'Oh yeah, where you living?'}]
  },
  {postId: postByUser2.postId,
  userWithUnread: user2,
  mails: [{
    sender: user3,
    text: 'Hey, I\'ve been coaching for ten years, let\'s meet for a coffee'},
    {sender: user2,
    text: 'Maybe - how many hours a week do you have spare?'},
    {sender: user3,
    text: '10 hrs, I don\'t work much'}]
 },
 {postId: postByUser1.postId,
  userWithUnread: user1,
  mails: [{
    sender: user3,
    text: 'Hey - do you need help with coaching at all?'}]
 }
]