let enabled = false

const enable = (bool) => {
  enabled = !!bool
}

const debug = (...args) => {
  if (enabled)
    console.warn('DEBUG:', ...args)
}

module.exports = {enable, debug}
