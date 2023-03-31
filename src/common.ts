const _log = console.log.bind(console)
console.log = function () {
  _log.apply(null, [`time: ${new Date().toLocaleString()}`, ...arguments])
}
