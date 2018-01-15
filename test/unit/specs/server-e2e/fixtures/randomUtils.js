export function oneToThree (generator) {
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

export function randomlyOnceIn (n) {
  return (Math.random() * n) > 1.0
}

export function selectionOf (things, oneInN) {
  const result = []
  for (const thing of things) {
    if (randomlyOnceIn(oneInN)) {
      result.push(thing)
    }
  }
  return result
}

export function randomInt (atLeast, lessThan) {
  const range = lessThan - atLeast
  return Math.floor(Math.random() * range) + atLeast
}
