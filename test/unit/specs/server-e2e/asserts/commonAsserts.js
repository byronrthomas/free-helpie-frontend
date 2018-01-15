const expectedTimingsStructure = {
  regularAmount: expect.any(Object),
  slots: expect.any(Array)
}

const expectedRegularAmtStructre = {
  unit: expect.any(String),
  frequency: expect.any(String)
}

export function checkTimingsProperty (timings) {
  expect(timings).toEqual(expect.objectContaining(expectedTimingsStructure))
  expect(timings.regularAmount).toEqual(expect.objectContaining(expectedRegularAmtStructre))
}
