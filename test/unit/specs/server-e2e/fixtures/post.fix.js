import faker from 'faker'
import { generateLocations, generateInterests, generateSkills, generateDescription, generateTimings } from './sharedFixtures'
import { randomlyOnceIn, randomInt } from './randomUtils'

const allPostTypes = ['helpOffered', 'helpWanted']
function generatePostType () {
  return allPostTypes[randomInt(0, 2)]
}

function one () {
  return {
    title: faker.lorem.sentence(),
    locations: generateLocations(),
    interests: generateInterests(),
    skills: generateSkills(),
    remote: randomlyOnceIn(2),
    description: generateDescription(),
    timings: generateTimings(),
    postType: generatePostType()
  }
}

export const postFix = {
  one
}
