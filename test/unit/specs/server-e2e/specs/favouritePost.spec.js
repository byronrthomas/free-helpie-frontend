import { initServer } from '../lib/test.lib'
import { postLib, arrayContainingLastPostId } from '../lib/post.lib'
import { favouritesLib } from '../lib/favourites.lib'

// TODO: check unfavourite route

describe('Favourite post', () => {
  const state = {}
  initServer(state)

  describe('Normal behaviours', () => {
    postLib.setupOne(state)

    it('should not be favourited initially', () => {
      return favouritesLib.get(state)
        .then(resp => expect(resp.data).not.toEqual(arrayContainingLastPostId(state)))
    })

    it('should be possible to favourite a post and see favourites update', () => {
      return favouritesLib.favouriteLatestPost(state)
        .then(() => favouritesLib.get(state))
        .then(resp => expect(resp.data).toEqual(arrayContainingLastPostId(state)))
    })
  })
})
