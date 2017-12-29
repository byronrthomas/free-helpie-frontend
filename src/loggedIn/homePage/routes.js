import LatestPostsPage from './LatestPostsPage.vue'
import PostDetailPage from './PostDetailPage.vue'
import SavedPostsPage from './SavedPostsPage.vue'
import MailboxPage from './MailboxPage.vue'
import MailDetailPage from './MailDetailPage.vue'
import YourPostsPage from './YourPostsPage.vue'
import EditPostPage from './EditPostPage.vue'
import CreatePostPage from './CreatePostPage.vue'

function getMailDetailProps (route) {
  const threadId = {
    relatedToPostId: route.query.post,
    threadAuthor: route.query.author
  }
  return {threadId, postAuthor: route.query.poster}
}

export const HOME_COMPONENT_ROUTES = [
  {path: 'latestPosts', component: LatestPostsPage, name: 'latestPosts'},
  {path: 'postDetail/:postId', component: PostDetailPage, name: 'postDetail', props: true},
  {path: 'savedPosts', component: SavedPostsPage, name: 'savedPosts'},
  {path: 'yourPosts', component: YourPostsPage, name: 'yourPosts'},
  {path: 'mailbox', component: MailboxPage, name: 'mailbox'},
  {path: 'mailDetail', component: MailDetailPage, name: 'mailDetail', props: getMailDetailProps},
  {path: 'createPost', component: CreatePostPage, name: 'createPost'},
  {path: 'editPost/:postId', component: EditPostPage, name: 'editPost', props: true}
]
