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

const expectedTimingsStructure = {
  regularAmount: expect.any(Object),
  slots: expect.any(Array)
}

const expectedRegularAmtStructre = {
  unit: expect.any(String),
  frequency: expect.any(String)
}

function checkProperties (profile) {
  expect(profile).toEqual(expect.objectContaining(expectedStructure))
  expect(profile.personalInfo).toEqual(expect.objectContaining(expectedPInfoStructure))
  expect(profile.timings).toEqual(expect.objectContaining(expectedTimingsStructure))
  expect(profile.timings.regularAmount).toEqual(expect.objectContaining(expectedRegularAmtStructre))
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
