import faker from 'faker'
import { generateLocations, generateInterests, generateSkills, generateDescription, generateLocationTypes, generateTimings } from './sharedFixtures'

function one () {
  return {
    personalInfo: {
      name: faker.name.findName(),
      photo: null
    },
    locations: generateLocations(),
    interests: generateInterests(),
    skills: generateSkills(),
    description: generateDescription(),
    locationTypes: generateLocationTypes(),
    timings: generateTimings(),
    agreedToTsAndCs: true
  }
}

export const profileFix = {
  one
}
