import faker from 'faker'
import { randomlyOnceIn, randomInt, selectionOf, oneToThree } from './randomUtils'

export function generateLocationTypes () {
  return selectionOf(['Remote', 'FromHome'], 2)
}

export function generateTimeslots () {
  return selectionOf(['Weekends', 'Evenings', 'Weekdays', 'Daytimes'], 2)
}

export function generateTimings () {
  const hrs = `${randomInt(1, 5)}hr`
  const freq = randomlyOnceIn(2) ? 'Week' : 'Month'

  return {
    regularAmount: {
      unit: hrs,
      frequency: freq},
    slots: generateTimeslots()
  }
}

export function generateLocations () {
  return oneToThree(faker.address.city)
}

export function generateInterests () {
  return oneToThree(faker.lorem.word)
}

export function generateSkills () {
  return oneToThree(faker.commerce.department)
}

export function generateDescription () {
  return faker.lorem.sentences()
}
