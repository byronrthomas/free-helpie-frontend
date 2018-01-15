import { checkTimingsProperty } from './commonAsserts'

const expectedStructure = {
  personalInfo: expect.any(Object),
  locations: expect.any(Array),
  interests: expect.any(Array),
  skills: expect.any(Array),
  description: expect.any(String),
  locationTypes: expect.any(Array),
  timings: expect.any(Object),
  agreedToTsAndCs: expect.any(Boolean)
}

const expectedPInfoStructure = {
  name: expect.any(String),
  photo: null
}

function checkProperties (profile) {
  expect(profile).toEqual(expect.objectContaining(expectedStructure))
  expect(profile.personalInfo).toEqual(expect.objectContaining(expectedPInfoStructure))
  checkTimingsProperty(profile.timings)
}

function checkValues (profile) {

}

function checkAll (profile) {
  expect(profile).not.toBeNull()
  expect(profile).not.toBeUndefined()

  checkProperties(profile)
  checkValues(profile)
}

export function assertMatchingProfile (expected, actual) {
  checkAll(actual)
  expect(actual).toEqual(expected)
}
