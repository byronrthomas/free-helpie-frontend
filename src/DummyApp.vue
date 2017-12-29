<template>
  <mailbox-container 
    :thread-summaries="summaries"
    :user-id="userId"
    :user-infos="userInfo"
    :post-infos="postInfo"
  />  
</template>


<script>
import MailboxContainer from './loggedIn/homePage/MailboxContainer.vue'

const POST_AUTHOR1_POST = {
  title: 'Other users post1',
  id: 1
}
const POST_AUTHOR2_POST = {
  title: 'Other users post2',
  id: 2
}
const MY_POST1 = {
  title: 'My post1',
  id: 3
}
const MY_POST2 = {
  title: 'My post2',
  id: 4
}
const POST_INFO = {}
for (const post of [POST_AUTHOR1_POST, POST_AUTHOR2_POST, MY_POST1, MY_POST2]) {
  POST_INFO[post.id] = post
}

const POST_AUTHOR1 = {
  id: 100,
  name: 'PostAuthor1'
}
const POST_AUTHOR2 = {
  id: 101,
  name: 'PostAuthor2'
}
const THREAD_AUTHOR1 = {
  id: 103,
  name: 'SomebodyStartingAThread1'
}
const THREAD_AUTHOR2 = {
  id: 104,
  name: 'SomebodyStartingAThread2'
}
const ME = {
  id: 777,
  name: 'Me / YOU!'
}
const USER_INFO = {}
for (const user of [POST_AUTHOR1, POST_AUTHOR2, THREAD_AUTHOR2, THREAD_AUTHOR1]) {
  USER_INFO[user.id] = user
}

function makeSummary (post, threadAuthor, postAuthor, shouldBeUnread, date) {
  return {
    threadId: {
      relatedToPostId: post.id,
      threadAuthor: threadAuthor.id
    },
    postAuthor: postAuthor.id,
    unread: shouldBeUnread,
    latestMessageSent: date
  }
}

const THREAD_SUMMARIES = [
  makeSummary(POST_AUTHOR1_POST, ME, POST_AUTHOR1, false, new Date(2014, 4, 1)),
  makeSummary(POST_AUTHOR2_POST, ME, POST_AUTHOR2, true, new Date(2014, 3, 1)),
  makeSummary(MY_POST1, THREAD_AUTHOR1, ME, false, new Date(2014, 2, 20)),
  makeSummary(MY_POST1, THREAD_AUTHOR2, ME, true, new Date(2014, 2, 19)),
  makeSummary(MY_POST2, THREAD_AUTHOR2, ME, true, new Date(2014, 2, 18))
]

export default {
  data () {
    return {
      summaries: THREAD_SUMMARIES,
      userId: ME.id,
      userInfo: USER_INFO,
      postInfo: POST_INFO}
  },
  components: {
    'mailbox-container': MailboxContainer
  }
}
</script>

