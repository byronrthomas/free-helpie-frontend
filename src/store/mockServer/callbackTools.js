export function runAll(method, datas) {
  for (let i in datas) {
    method(datas[i], () => {}, err => {throw err})
  }
}