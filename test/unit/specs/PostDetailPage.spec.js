import { shallow, createLocalVue, mount } from 'vue-test-utils'

import PostDetailPage from '@/loggedIn/homePage/PostDetailPage.vue'
import MailThreadContainer from '@/loggedIn/homePage/shared/MailThreadContainer.vue'
import { rootGetters } from '@/store/store'
import { singlePostStore } from '@/loggedIn/homePage/singlePostStore'
import { fail } from 'assert';
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

const TEST_USER_ID = 777

const emptyPost = {
  skills: [],
  locations: [],
  interests: [],
  timings: {
    regularAmount: {
      unit: '',
      frequency: ''
    },
    slots: []
  }
}

const currentUsersPostId = 1
const testPostData = {
  postedBy: TEST_USER_ID, ...emptyPost
}

const otherUserPostId = 2
const OTHER_USER_ID = 555
const otherUserPostData = {
  postedBy: OTHER_USER_ID, ...emptyPost
}

const testEmails = [
  {
    sender: TEST_USER_ID,
    text: 'Hello, I could help you',
    relatedToPostId: 1,
    sent: new Date(2010, 1, 1),
    replayToMailId: -1,
    id: 0},
  {
    sender: OTHER_USER_ID,
    text: 'That would be great, thanks - how far away do you live?',
    relatedToPostId: 1,
    sent: new Date(2010, 1, 2),
    replayToMailId: 0,
    id: 1},
  {
    sender: TEST_USER_ID,
    text: 'Bolton. Should we exchange contact details?',
    relatedToPostId: 1,
    sent: new Date(2010, 1, 3),
    replayToMailId: 1,
    id: 2}
]

let postStore = {post: null}

const USER_DISPLAY_INFOS = {}
USER_DISPLAY_INFOS[TEST_USER_ID] = {name: 'TheCurrentUser'}
USER_DISPLAY_INFOS[OTHER_USER_ID] = {name: 'AnOtherUser'}

function updatePostStore(postId) {
  if (postId === currentUsersPostId) {
    postStore.post = testPostData
  } else if (postId === otherUserPostId) {
    postStore.post = otherUserPostData
  } else {
    throw new Error(`Cannot handle getPost on postId ${postId}`)
  }
}

function storeConfig (emails, actions) {
  return {
    getters: {
      userId (state) {return TEST_USER_ID}
    },
    modules: {
      loggedin: {
        namespaced: true,
        getters: {
          favouritePostIds (state) {return []},
        },
        modules: {
          postdetails: {
            namespaced: true,
            getters: {
              post (state) { return postStore.post },
              profileInfo (state) {
                return USER_DISPLAY_INFOS
              }
            },
            actions: {
              getPost ({state}, postId) {
                updatePostStore(postId)
              }
            }
          },
          postthread: {
            namespaced: true,
            actions: actions,
            getters: {
              mailItems (state) {
                return emails
              }
            }
          }
        }
      }
    }
  }
}

describe('PostDetailsPage', () => {
  let actions
  let store

  beforeEach(() => {
    actions = {
      getMailThread: jest.fn(),
      newMail: jest.fn()
    }
    store = new Vuex.Store(storeConfig(testEmails, actions))
  })

  it('should dispatch getMailThread(thread_id, sent_date ASC) if post.postedBy !== currentUser', () => {
    shallow(PostDetailPage, {localVue, store, propsData: {postId: otherUserPostId}})

    const expectedActionData = {
      relatedToPostId: otherUserPostId,
      sortField: 'sent',
      sortOrderAsc: true,
      threadAuthor: TEST_USER_ID
    }
    expect(actions.getMailThread.mock.calls.length).toEqual(1)
    expect(actions.getMailThread.mock.calls[0][1]).toEqual(expectedActionData)
  })

  it('should display a link to the mailbox if post.postedBy === currentUser', () => {
    const onTest = mount(PostDetailPage, {localVue, store, propsData: {postId: currentUsersPostId}})
    expect(onTest.vm.postedByCurrentUser).toBe(true)

    expect(onTest.contains('#linkToMailbox')).toBe(true)
  })

  it('should dispatch newEmail(post_id, post_author, thread_author, msg_text) if it receives a sendEmail event', () => {
    const onTest = shallow(PostDetailPage, {localVue, store, propsData: {postId: otherUserPostId}})

    const emailText = 'This is a test email'
    // Ideally we would trigger the event from the MTC, rather than call the method directly
    onTest.vm.sendMail(emailText)

    const expectedMailData = {
      threadAuthor: TEST_USER_ID,
      relatedToPostId: otherUserPostId,
      mailText: emailText
    }
    expect(actions.newMail.mock.calls.length).toEqual(1)
    expect(actions.newMail.mock.calls[0][1]).toEqual(expectedMailData)
  })

  it('should pass on mails in the thread to its MailThreadContainer component', () => {
    const onTest = mount(PostDetailPage, {localVue, store, propsData: {postId: otherUserPostId}})
    
    expect(onTest.find(MailThreadContainer).vm.mailItems).toEqual(testEmails)
  })

  it('should pass cancelConnectState as disabled to its MailThreadContainer component if there are no emails', () => {
    const noEmailsStore = new Vuex.Store(storeConfig([], actions))
    const onTest = mount(PostDetailPage, {localVue, store: noEmailsStore, propsData: {postId: otherUserPostId}})
    
    expect(onTest.find(MailThreadContainer).vm.connectOrCancelAllowed).toEqual('disabled')
  })

  it('should pass cancelConnectState as connectAllowed to its MailThreadContainer component if there are no emails', () => {
    const onTest = mount(PostDetailPage, {localVue, store, propsData: {postId: otherUserPostId}})
    
    expect(onTest.find(MailThreadContainer).vm.connectOrCancelAllowed).toEqual('connectAllowed')
  })
})
