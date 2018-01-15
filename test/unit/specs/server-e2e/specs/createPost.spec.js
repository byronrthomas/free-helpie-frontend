import { initServer } from '../lib/test.lib'
import { assertMatchingPostReturned } from '../asserts/postAsserts'
import { postFix } from '../fixtures/post.fix'
import { accountLib } from '../lib/account.lib'
import { postLib } from '../lib/post.lib'

// TODO: put / delete / etc and other forms of filtering not yet covered

describe('Create post', () => {
  const state = {}
  initServer(state)

  describe('Normal behaviours', () => {
    accountLib.setupOneLoggedIn(state)

    it('should be possible to create a post and get it back', () => {
      const postData = postFix.one()
      return postLib.create(state, postData)
        .then(resp => postLib.getCurrentUserPosts(state))
        .then(resp => assertMatchingPostReturned(postData, resp.data, state))
    })
  })
})
