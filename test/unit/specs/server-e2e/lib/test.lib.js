import {makeServer} from '@/store/mockServer'

export function initServer (serverState) {
  beforeEach(() => {
    for (const key in serverState) {
      if (serverState.hasOwnProperty(key)) {
        delete serverState.key;
      }
    }
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
