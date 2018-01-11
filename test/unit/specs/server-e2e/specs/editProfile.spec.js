import { initServer } from '../lib/test.lib'
import { assertMatchingProfile } from '../asserts/profileAsserts'
import { profileFix } from '../fixtures/profile.fix'
import { profileLib } from '../lib/profile.lib'

describe('Edit profile', () => {
  const state = {}
  initServer(state)

  describe('Normal behaviours', () => {
    profileLib.setupOne(state)
    
    it('should be possible to create a profile and get it back', () => {
      const profileData = profileFix.one()
      return profileLib.edit(state, profileData)
        .then(() => profileLib.get(state))
        .then(resp => assertMatchingProfile(profileData, resp.data))
    })
  })
}) 

