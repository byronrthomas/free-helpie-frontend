const CONNECTION_REQUESTS = [
  {
    id: 0,
    postSubject: 'Can somebody give me some executive coaching please',
    connectionName: 'Jana Swiss',
    inviteSent: new Date(2000, 3, 1, 19, 10, 15)
  },
  {
    id: 1,
    postSubject: 'Can somebody give me some executive coaching please',
    connectionName: 'A.N.Other',
    inviteSent: new Date(2000, 3, 1, 16, 17, 4)
  }
]

const PENDING_INVITES = [
  {
    id: 2,
    postSubject: 'Help around Garden',
    connectionName: 'John Doe',
    inviteSent: new Date(2000, 4, 1, 9, 34, 47)
  },
  {
    id: 3,
    postSubject: 'Some other post',
    connectionName: 'A.N.Other',
    inviteSent: new Date(2000, 5, 1, 16, 17, 4)
  }
]

const ACTIVE_CONNECTIONS = [
  {
    id: 4,
    postSubject: '',
    connectionName: 'Wendy Small',
    inviteSent: new Date(2000, 1, 1, 17, 0, 4)
  }
]

const JOHN_DOE_POST = 0
const TEST_USER_POST = 4
const WENDY_SMALL_POST = 1
const A_N_OTHER2_POST = 5
function inviteToTestUser (fromUser, relatedToPostId, timestamp) {
  return {toUser: TEST_USER, fromUser, relatedToPostId, timestamp}
}

function inviteFromTestUser (toUser, relatedToPostId, timestamp) {
  return {fromUser: TEST_USER, toUser, relatedToPostId, timestamp}
}

const TEST_USER = 3
const WENDY_SMALL = 1
const JOHN_DOE = 0
const JANA_SWISS = 2
const A_N_OTHER1 = 4
const A_N_OTHER2 = 5

export const INITIAL_CONNECTION_INVITES = [
  // Invites sent to TEST_USER
  inviteToTestUser(JANA_SWISS, TEST_USER_POST, new Date(2000, 3, 1, 19, 10, 15)),
  inviteToTestUser(A_N_OTHER1, TEST_USER_POST, new Date(2000, 3, 1, 16, 17, 4)),
  
  // Invites sent from TEST_USER
  inviteFromTestUser(JOHN_DOE, JOHN_DOE_POST, Date(2000, 4, 1, 9, 34, 47)),
  inviteFromTestUser(A_N_OTHER2, A_N_OTHER2_POST, new Date(2000, 5, 1, 16, 17, 4)),
  
  // Active, invite both ways
  inviteToTestUser(WENDY_SMALL, TEST_USER_POST, new Date(2000, 1, 1, 16, 17, 4)),
  inviteFromTestUser(WENDY_SMALL, WENDY_SMALL_POST, new Date(2000, 1, 1, 17, 0, 4))
]