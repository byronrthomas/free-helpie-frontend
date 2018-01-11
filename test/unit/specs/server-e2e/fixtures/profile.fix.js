import faker from 'faker'


function oneToThree(generator) {
  const rand = Math.random() * 3
  const result = [generator()]
  if (rand > 1.0) {
    result.push(generator())
  }
  if (rand > 2.0) {
    result.push(generator())
  }
  return result
}

function randomlyOnceIn(n) {
  return (Math.random() * n) > 1.0
}

function selectionOf(things, oneInN) {
  const result = []
  for (const thing of things) {
    if (randomlyOnceIn(oneInN)) {
      result.push(thing)
    }
  }
  return result
}

function generateLocationTypes () {
  return selectionOf(['Remote', 'FromHome'], 2)
}

function generateTimeslots () {
  return selectionOf(['Weekends', 'Evenings', 'Weekdays', 'Daytimes'], 2)
}

function randomInt(atLeast, lessThan) {
  const range = lessThan - atLeast
  return Math.floor(Math.random() * lessThan) + atLeast
}

function generateTimings () {
  const hrs = `${randomInt(1, 5)}hr`
  const freq = randomlyOnceIn(2) ? 'Week' : 'Month'

  return {
    regularAmount: {
      unit: hrs,
      frequency: freq},
    slots: generateTimeslots()
  }
}

function one () {
  return {
    personalInfo: {
      name: faker.name.findName(),
      photo: null
    },
    locations: oneToThree(faker.address.city),
    interests: oneToThree(faker.lorem.word),
    skills: oneToThree(faker.commerce.department),
    description: faker.lorem.sentences(),
    locationTypes: generateLocationTypes(),
    timings: generateTimings(),
    agreedToTsAndCs: true
  }

}

export const profileFix = {
  one
}