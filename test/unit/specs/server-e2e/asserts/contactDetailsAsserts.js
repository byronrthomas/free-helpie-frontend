const expectedStructure = {
  email: expect.any(String),
  phone: expect.any(String),
  address: expect.any(String),
  dateOfBirth: expect.any(String)
}

function checkProperties (contactDetails) {
  expect(contactDetails).toEqual(expect.objectContaining(expectedStructure))
}

function checkValues (contactDetails) {

}

function checkAll (contactDetails) {
  expect(contactDetails).not.toBeNull()
  expect(contactDetails).not.toBeUndefined()

  checkProperties(contactDetails)
  checkValues(contactDetails)
}

export function assertMatchingDetails (expected, actual) {
  checkAll(actual)
  expect(actual).toEqual(expected)
}
