import { initServer } from '../lib/test.lib'
import { assertMatchingDetails } from '../asserts/contactDetailsAsserts'
import { contactDetailsFix } from '../fixtures/contactDetails.fix'
import { contactDetailsLib } from '../lib/contactDetails.lib'

describe('Edit contact details', () => {
  const state = {}
  initServer(state)

  describe('Normal behaviours', () => {
    contactDetailsLib.setupOne(state)

    it('should be possible to edit a contact details and get it back', () => {
      const contactDetailsData = contactDetailsFix.one()
      return contactDetailsLib.edit(state, contactDetailsData)
        .then(() => contactDetailsLib.get(state))
        .then(resp => assertMatchingDetails(contactDetailsData, resp.data))
    })
  })
})
