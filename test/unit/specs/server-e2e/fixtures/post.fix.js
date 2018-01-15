import faker from 'faker'
import { generateLocations, generateInterests, generateSkills, generateDescription, generateTimings } from './sharedFixtures'
import { randomlyOnceIn } from './randomUtils'

function one () {
  return {
    title: faker.lorem.sentence(),
    locations: generateLocations(),
    interests: generateInterests(),
    skills: generateSkills(),
    remote: randomlyOnceIn(2),
    description: generateDescription(),
    timings: generateTimings()
  }
}

export const postFix = {
  one
}
