const TEST_USER = 3  // This needs to be kept up to date
const JOHN_DOE = 0  // This needs to be kept up to date
const JOHN_DOE_POST_ID = 0  // This is a guess, but should be OK
const THREAD_FROM_TEST_TO_JOHN_DOE = {
  relatedToPostId: JOHN_DOE_POST_ID,
  threadAuthor: TEST_USER,
  postAuthor: JOHN_DOE}

const JOHN_DOE_POST_ID2 = 3
const THREAD_FROM_TEST_TO_JOHN_DOE2 = {
  relatedToPostId: JOHN_DOE_POST_ID2,
  threadAuthor: TEST_USER,
  postAuthor: JOHN_DOE}

const TEST_USER_POST_ID = 4 // This is a guess, but should be OK
const JANA_SWISS = 2 // This needs to kept up to date
const WENDY_SMALL = 1  // This needs to kept up to date
const THREAD_FROM_JANA_TO_TEST = {
  relatedToPostId: TEST_USER_POST_ID,
  threadAuthor: JANA_SWISS,
  postAuthor: TEST_USER}
const THREAD_FROM_WENDY_TO_TEST = {
  relatedToPostId: TEST_USER_POST_ID,
  threadAuthor: WENDY_SMALL,
  postAuthor: TEST_USER}

let mailSentDay = 1
function makeEmail (threadId, text, sender) {
  return {
    threadId: {threadAuthor: threadId.threadAuthor, relatedToPostId: threadId.relatedToPostId},
    postAuthor: threadId.postAuthor,
    mailData: {
      text: text,
      sender: sender,
      sent: new Date(2000, 0, mailSentDay++)
    }
  }
}

export const INITIAL_MAILS = [
  makeEmail(THREAD_FROM_TEST_TO_JOHN_DOE, 'I could help you', TEST_USER),
  makeEmail(THREAD_FROM_TEST_TO_JOHN_DOE, 'Oh yeah, where you living?', JOHN_DOE),
  makeEmail(THREAD_FROM_TEST_TO_JOHN_DOE2, 'Hi, I could probably do this too', TEST_USER),
  makeEmail(THREAD_FROM_JANA_TO_TEST, 'Hey, I\'ve been coaching for ten years, let\'s meet for a coffee', JANA_SWISS),
  makeEmail(THREAD_FROM_JANA_TO_TEST, 'Maybe - how many hours a week do you have spare?', TEST_USER),
  makeEmail(THREAD_FROM_JANA_TO_TEST, '10 hrs, I don\'t work much', JANA_SWISS),
  makeEmail(THREAD_FROM_WENDY_TO_TEST, 'Hey - I could maybe you mentor through this phase?', WENDY_SMALL),
  makeEmail(THREAD_FROM_WENDY_TO_TEST, 'Hi, did you see my last email?')
]

export const INITIAL_READ_MAILS = [
  {threadId: THREAD_FROM_TEST_TO_JOHN_DOE, readId: 1},
  {threadId: THREAD_FROM_JANA_TO_TEST, readId: 3},
  {threadId: THREAD_FROM_WENDY_TO_TEST, readId: 6}
]
