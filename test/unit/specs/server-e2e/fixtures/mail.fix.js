import faker from 'faker'

function one () {
  return {
    mailText: faker.lorem.sentences()
  }
}

export const mailFix = {
  one
}
