import { initServer } from '../lib/test.lib'
import { assertMatchingDetails } from '../asserts/contactDetailsAsserts'
import { contactDetailsFix } from '../fixtures/contactDetails.fix'
import { accountLib } from '../lib/account.lib'
import { contactDetailsLib } from '../lib/contactDetails.lib'

describe('Create contact details', () => {
  const state = {}
  initServer(state)

  describe('Normal behaviours', () => {
    accountLib.setupOneLoggedIn(state)

    it('should be possible to create a contact details record and get it back', () => {
      const contactData = contactDetailsFix.one()
      return contactDetailsLib.create(state, contactData)
        .then(() => contactDetailsLib.get(state))
        .then(resp => assertMatchingDetails(contactData, resp.data))
    })
  })
})
