import {makeServer} from '@/store/mockServer'

export function initServer (serverState) {
  beforeEach(() => {
    serverState.server = makeServer()
  })
}

export function getServer (state) {
  if (!state.server) {
    console.log('state = ', state)
    throw new Error('state.server is not defined')
  }
  return state.server
}
