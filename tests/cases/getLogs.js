const querystring = require('querystring')
const config = require('../../app/config')
const invoke = require('../invoke')

module.exports = (year, month, day, hour, minute, second, milliSecond) => {
  const searchParams = querystring.stringify({
    year,
    month,
    day,
    hour,
    minute,
    second,
    milliSecond
  })
  const options = {
    hostname: config.api.host,
    port: config.api.port,
    path: `/api/v1/logs?${searchParams}`,
    method: 'GET'
  }
  return invoke.http.get(options)
}
