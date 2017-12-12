import LatestPostsPage from './LatestPostsPage.vue'
import PostDetailPage from './PostDetailPage.vue'
import SavedAdsPage from './SavedAdsPage.vue'
import MailboxPage from './MailboxPage.vue'
import MailDetailPage from './MailDetailPage.vue'

export const HOME_COMPONENT_ROUTES = [
  {path: 'latestPosts', component: LatestPostsPage, name: "latestPosts"},
  {path: 'postDetail/:id', component: PostDetailPage, name: "postDetail", props: true},
  {path: 'savedPosts', component: SavedAdsPage, name: "savedPosts"},
  {path: 'mailbox', component: MailboxPage, name: "mailbox"},
  {path: 'mailDetail/:id', component: MailDetailPage, name: "mailDetail", props: true}
]
