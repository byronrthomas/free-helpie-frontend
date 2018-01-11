import { initServer } from '../lib/test.lib'
import { assertMatchingProfile } from '../asserts/profileAsserts'
import { profileFix } from '../fixtures/profile.fix'
import { accountLib } from '../lib/account.lib'
import { profileLib } from '../lib/profile.lib'

describe('Create profile', () => {
  const state = {}
  initServer(state)

  describe('Normal behaviours', () => {
    accountLib.setupOneLoggedIn(state)

    it('should be possible to create a profile and get it back', () => {
      const profileData = profileFix.one()
      return profileLib.create(state, profileData)
        .then(() => profileLib.get(state))
        .then(resp => assertMatchingProfile(profileData, resp.data))
    })
  })
})
