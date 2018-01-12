import faker from 'faker'

function generateAddress () {
  const num = faker.address.streetAddress()
  const street = faker.address.streetName()
  const city = faker.address.city()
  const code = faker.address.zipCode()
  return `${num} ${street}, ${city}, ${code}`
}

function one () {
  return {
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    address: generateAddress(),
    dateOfBirth: faker.date.past().toString()
  }
}

export const contactDetailsFix = {
  one
}
