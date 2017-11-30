function makeReversibleMap() {
  let map = {}
  let backMap = {}

  return {
    put(key, value) {
      map[key] = value;
      backMap[value] = key;
    },
    getByKey(key) {
      return map[key];
    },
    getByValue(value) {
      return backMap[value];
    }
  }
}

function UserAuthServer () {
  let usersToPassword = {'test@test.com': 'secret'}
  let usersToAuth = makeReversibleMap()

  return {
    get (reqData, resolve, reject) {
      if (typeof (usersToPassword[reqData.username]) === 'string') {
        if (usersToPassword[reqData.username] === reqData.password) {
          usersToAuth.put(reqData.username, Math.random().toString())
          resolve({authData: usersToAuth.getByKey(reqData.username)})
        } else {
          reject('Password not recognised')
        }
      } else {
        reject('Username not recognised')
      }
    }
  }
}

const MOCK_NETWORK_LATENCY = 500
function Server (userAuth) {
  return {
    get (resourcePath, data) {
      if (resourcePath === '/users') {
        return new Promise(
          (resolve, reject) => {
            setTimeout(
              () => userAuth.get(data, resolve, reject),
              MOCK_NETWORK_LATENCY)
          })
      }
    }
  }
}

export const mockServer = new Server(new UserAuthServer())
