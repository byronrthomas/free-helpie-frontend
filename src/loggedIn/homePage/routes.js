import LatestPostsPage from './LatestPostsPage.vue'
import PostDetailPage from './PostDetailPage.vue'
import SavedPostsPage from './SavedPostsPage.vue'
import MailboxPage from './MailboxPage.vue'
import MailDetailPage from './MailDetailPage.vue'
import YourPostsPage from './YourPostsPage.vue'
import EditPostPage from './EditPostPage.vue'
import CreatePostPage from './CreatePostPage.vue'
import YourConnectionsPage from './YourConnectionsPage.vue'
import UserDetailPage from './UserDetailPage.vue'

function getMailDetailProps (route) {
  const threadId = {
    relatedToPostId: parseInt(route.query.post),
    threadAuthor: parseInt(route.query.author)
  }
  return {threadId, postAuthor: parseInt(route.query.poster)}
}

export const HOME_COMPONENT_ROUTES = [
  {path: 'latestPosts', component: LatestPostsPage, name: 'latestPosts'},
  {path: 'postDetail/:postId', component: PostDetailPage, name: 'postDetail', props: true},
  {path: 'savedPosts', component: SavedPostsPage, name: 'savedPosts'},
  {path: 'yourPosts', component: YourPostsPage, name: 'yourPosts'},
  {path: 'mailbox', component: MailboxPage, name: 'mailbox'},
  {path: 'mailDetail', component: MailDetailPage, name: 'mailDetail', props: getMailDetailProps},
  {path: 'createPost', component: CreatePostPage, name: 'createPost'},
  {path: 'editPost/:postId', component: EditPostPage, name: 'editPost', props: true},
  {path: 'yourConnections', component: YourConnectionsPage, name: 'yourConnections'},
  {path: 'userDetail/:userId', component: UserDetailPage, name: 'userDetail', props: true},
]
