const invoke = require('../invoke')
const config = require('../../app/config')

module.exports = () => {
  const options = {
    hostname: config.api.host,
    port: config.api.port,
    path: '/_health',
    method: 'GET'
  }
  return invoke.http.get(options)
}
